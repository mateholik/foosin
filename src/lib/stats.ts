import type { Game, Player } from "@/lib/supabase";

export type LeaderboardRow = {
  playerId: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
};

export type RecentGameRow = {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  createdAt: string;
};

export type TeammateRow = {
  pairKey: string;
  team: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
};

export function computeLeaderboard(players: Player[], games: Game[]): LeaderboardRow[] {
  const rows = new Map<
    string,
    { name: string; wins: number; losses: number; gamesPlayed: number }
  >();

  for (const player of players) {
    rows.set(player.id, { name: player.name, wins: 0, losses: 0, gamesPlayed: 0 });
  }

  for (const game of games) {
    const teamA = [game.player_a1, game.player_a2];
    const teamB = [game.player_b1, game.player_b2];
    const teamAWon = game.score_a > game.score_b;

    for (const playerId of [...teamA, ...teamB]) {
      const row = rows.get(playerId);
      if (row) row.gamesPlayed += 1;
    }

    for (const playerId of teamA) {
      const row = rows.get(playerId);
      if (!row) continue;
      if (teamAWon) row.wins += 1;
      else row.losses += 1;
    }

    for (const playerId of teamB) {
      const row = rows.get(playerId);
      if (!row) continue;
      if (teamAWon) row.losses += 1;
      else row.wins += 1;
    }
  }

  return Array.from(rows.entries())
    .map(([playerId, row]) => ({
      playerId,
      name: row.name,
      wins: row.wins,
      losses: row.losses,
      gamesPlayed: row.gamesPlayed,
      winRate: row.gamesPlayed === 0 ? 0 : row.wins / row.gamesPlayed,
    }))
    .sort((first, second) => {
      if (second.winRate !== first.winRate) return second.winRate - first.winRate;
      if (second.gamesPlayed !== first.gamesPlayed) {
        return second.gamesPlayed - first.gamesPlayed;
      }
      if (second.wins !== first.wins) return second.wins - first.wins;
      return first.name.localeCompare(second.name);
    });
}

export function computeRecentGames(players: Player[], games: Game[]): RecentGameRow[] {
  const names = new Map(players.map((player) => [player.id, player.name]));

  return [...games]
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
    )
    .slice(0, 10)
    .map((game) => ({
      id: game.id,
      teamA: [names.get(game.player_a1), names.get(game.player_a2)].filter(Boolean).join(" + "),
      teamB: [names.get(game.player_b1), names.get(game.player_b2)].filter(Boolean).join(" + "),
      scoreA: game.score_a,
      scoreB: game.score_b,
      createdAt: game.created_at,
    }));
}

export function computeBestTeammates(players: Player[], games: Game[]): TeammateRow[] {
  const names = new Map(players.map((player) => [player.id, player.name]));
  const pairs = new Map<
    string,
    {
      playerOne: string;
      playerTwo: string;
      wins: number;
      losses: number;
    }
  >();

  const registerPair = (firstId: string, secondId: string, won: boolean) => {
    const [playerOne, playerTwo] = [firstId, secondId].sort();
    const key = `${playerOne}:${playerTwo}`;
    const existing = pairs.get(key);
    if (existing) {
      if (won) existing.wins += 1;
      else existing.losses += 1;
      return;
    }

    pairs.set(key, {
      playerOne,
      playerTwo,
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
    });
  };

  for (const game of games) {
    const teamAWon = game.score_a > game.score_b;
    registerPair(game.player_a1, game.player_a2, teamAWon);
    registerPair(game.player_b1, game.player_b2, !teamAWon);
  }

  return Array.from(pairs.entries())
    .map(([pairKey, pair]) => {
      const gamesPlayed = pair.wins + pair.losses;
      return {
        pairKey,
        team: `${names.get(pair.playerOne) ?? "Unknown"} + ${
          names.get(pair.playerTwo) ?? "Unknown"
        }`,
        wins: pair.wins,
        losses: pair.losses,
        gamesPlayed,
        winRate: gamesPlayed === 0 ? 0 : pair.wins / gamesPlayed,
      };
    })
    .sort((first, second) => {
      if (second.winRate !== first.winRate) return second.winRate - first.winRate;
      if (second.gamesPlayed !== first.gamesPlayed) {
        return second.gamesPlayed - first.gamesPlayed;
      }
      return second.wins - first.wins;
    })
    .slice(0, 5);
}
