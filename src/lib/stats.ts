import type { Game, Player } from "@/lib/supabase";

export type LeaderboardRow = {
  playerId: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
  rating: number;
};

export type RecentGameRow = {
  id: string;
  teamA: string;
  teamAPlayers: string;
  teamB: string;
  teamBPlayers: string;
  scoreA: number;
  scoreB: number;
  createdAt: string;
};

export type TeammateRow = {
  teamId: string;
  teamName: string;
  team: string;
  rating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
};

export function computeLeaderboard(players: Player[], games: Game[]): LeaderboardRow[] {
  const BASE_ELO = 1000;
  const K_FACTOR = 24;
  const rows = new Map<
    string,
    { name: string; wins: number; losses: number; gamesPlayed: number; rating: number }
  >();

  for (const player of players) {
    rows.set(player.id, {
      name: player.name,
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      rating: BASE_ELO,
    });
  }

  const gamesByTime = [...games].sort(
    (first, second) =>
      new Date(first.created_at).getTime() - new Date(second.created_at).getTime()
  );

  for (const game of gamesByTime) {
    const teamA = [game.player_a1, game.player_a2];
    const teamB = [game.player_b1, game.player_b2];
    const teamAScore = game.score_a > game.score_b ? 1 : game.score_a < game.score_b ? 0 : 0.5;
    const teamBScore = 1 - teamAScore;
    const isTie = teamAScore === 0.5;
    const teamAWon = teamAScore === 1;

    for (const playerId of [...teamA, ...teamB]) {
      const row = rows.get(playerId);
      if (row) row.gamesPlayed += 1;
    }

    for (const playerId of teamA) {
      const row = rows.get(playerId);
      if (!row) continue;
      if (!isTie) {
        if (teamAWon) row.wins += 1;
        else row.losses += 1;
      }
    }

    for (const playerId of teamB) {
      const row = rows.get(playerId);
      if (!row) continue;
      if (!isTie) {
        if (teamAWon) row.losses += 1;
        else row.wins += 1;
      }
    }

    const teamARatings = teamA.map((playerId) => rows.get(playerId)?.rating ?? BASE_ELO);
    const teamBRatings = teamB.map((playerId) => rows.get(playerId)?.rating ?? BASE_ELO);
    const teamAAverageRating = (teamARatings[0] + teamARatings[1]) / 2;
    const teamBAverageRating = (teamBRatings[0] + teamBRatings[1]) / 2;

    const expectedTeamAScore =
      1 / (1 + 10 ** ((teamBAverageRating - teamAAverageRating) / 400));
    const expectedTeamBScore = 1 - expectedTeamAScore;

    const teamADelta = K_FACTOR * (teamAScore - expectedTeamAScore);
    const teamBDelta = K_FACTOR * (teamBScore - expectedTeamBScore);

    for (const playerId of teamA) {
      const row = rows.get(playerId);
      if (row) row.rating += teamADelta;
    }

    for (const playerId of teamB) {
      const row = rows.get(playerId);
      if (row) row.rating += teamBDelta;
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
      rating: Math.round(row.rating),
    }))
    .sort((first, second) => {
      if (second.rating !== first.rating) return second.rating - first.rating;
      if (second.gamesPlayed !== first.gamesPlayed) {
        return second.gamesPlayed - first.gamesPlayed;
      }
      if (second.winRate !== first.winRate) return second.winRate - first.winRate;
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
      teamA: game.team_a_name,
      teamAPlayers: `${names.get(game.player_a1) ?? "Unknown"} + ${
        names.get(game.player_a2) ?? "Unknown"
      }`,
      teamB: game.team_b_name,
      teamBPlayers: `${names.get(game.player_b1) ?? "Unknown"} + ${
        names.get(game.player_b2) ?? "Unknown"
      }`,
      scoreA: game.score_a,
      scoreB: game.score_b,
      createdAt: game.created_at,
    }));
}

export function computeBestTeammates(players: Player[], games: Game[]): TeammateRow[] {
  const BASE_ELO = 1000;
  const K_FACTOR = 24;
  const names = new Map(players.map((player) => [player.id, player.name]));
  const teams = new Map<
    string,
    {
      teamName: string;
      playersLabel: string;
      rating: number;
      wins: number;
      losses: number;
    }
  >();

  const registerTeam = (
    teamId: string,
    teamName: string,
    firstId: string,
    secondId: string,
    won: boolean
  ) => {
    const playersLabel = `${names.get(firstId) ?? "Unknown"} + ${names.get(secondId) ?? "Unknown"}`;
    const existing = teams.get(teamId);
    if (existing) {
      if (won) existing.wins += 1;
      else existing.losses += 1;
      return;
    }

    teams.set(teamId, {
      teamName,
      playersLabel,
      rating: BASE_ELO,
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
    });
  };

  const gamesByTime = [...games].sort(
    (first, second) =>
      new Date(first.created_at).getTime() - new Date(second.created_at).getTime()
  );

  for (const game of gamesByTime) {
    const teamAWon = game.score_a > game.score_b;
    registerTeam(game.team_a_id, game.team_a_name, game.player_a1, game.player_a2, teamAWon);
    registerTeam(game.team_b_id, game.team_b_name, game.player_b1, game.player_b2, !teamAWon);

    const teamA = teams.get(game.team_a_id);
    const teamB = teams.get(game.team_b_id);
    if (!teamA || !teamB) continue;

    const teamAScore = game.score_a > game.score_b ? 1 : game.score_a < game.score_b ? 0 : 0.5;
    const teamBScore = 1 - teamAScore;
    const expectedTeamAScore = 1 / (1 + 10 ** ((teamB.rating - teamA.rating) / 400));
    const expectedTeamBScore = 1 - expectedTeamAScore;

    const teamADelta = K_FACTOR * (teamAScore - expectedTeamAScore);
    const teamBDelta = K_FACTOR * (teamBScore - expectedTeamBScore);

    teamA.rating += teamADelta;
    teamB.rating += teamBDelta;
  }

  return Array.from(teams.entries())
    .map(([teamId, teamRow]) => {
      const gamesPlayed = teamRow.wins + teamRow.losses;
      return {
        teamId,
        teamName: teamRow.teamName,
        team: teamRow.playersLabel,
        rating: Math.round(teamRow.rating),
        wins: teamRow.wins,
        losses: teamRow.losses,
        gamesPlayed,
        winRate: gamesPlayed === 0 ? 0 : teamRow.wins / gamesPlayed,
      };
    })
    .sort((first, second) => {
      if (second.rating !== first.rating) return second.rating - first.rating;
      if (second.winRate !== first.winRate) return second.winRate - first.winRate;
      if (second.gamesPlayed !== first.gamesPlayed) {
        return second.gamesPlayed - first.gamesPlayed;
      }
      return second.wins - first.wins;
    })
    .slice(0, 5);
}
