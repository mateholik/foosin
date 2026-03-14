import { AdminGamesTable } from "@/components/AdminGamesTable";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminPlayersTable } from "@/components/AdminPlayersTable";
import { AdminTeamsTable } from "@/components/AdminTeamsTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { assertSupabaseEnv, type Game, type Player, type Team, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type AdminGameRow = {
  id: string;
  teamA: string;
  teamB: string;
  teamAPlayers: string;
  teamBPlayers: string;
  scoreA: number;
  scoreB: number;
  createdAt: string;
};

type AdminPlayerRow = {
  id: string;
  name: string;
  gamesCount: number;
  teamsCount: number;
};

type AdminTeamRow = {
  id: string;
  name: string;
  playersLabel: string;
  gamesCount: number;
};

async function getAdminGames(): Promise<AdminGameRow[]> {
  assertSupabaseEnv();
  const [playersResult, gamesResult] = await Promise.all([
    supabase.from("players").select("id,name"),
    supabase.from("games").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  if (playersResult.error) throw new Error(playersResult.error.message);
  if (gamesResult.error) throw new Error(gamesResult.error.message);

  const players = (playersResult.data ?? []) as Pick<Player, "id" | "name">[];
  const games = (gamesResult.data ?? []) as Game[];
  const namesById = new Map(players.map((player) => [player.id, player.name]));

  return games.map((game) => ({
    id: game.id,
    teamA: game.team_a_name,
    teamB: game.team_b_name,
    teamAPlayers: `${namesById.get(game.player_a1) ?? "Unknown"} + ${
      namesById.get(game.player_a2) ?? "Unknown"
    }`,
    teamBPlayers: `${namesById.get(game.player_b1) ?? "Unknown"} + ${
      namesById.get(game.player_b2) ?? "Unknown"
    }`,
    scoreA: game.score_a,
    scoreB: game.score_b,
    createdAt: game.created_at,
  }));
}

async function getAdminPlayers(): Promise<AdminPlayerRow[]> {
  assertSupabaseEnv();
  const [playersResult, gamesResult, teamsResult] = await Promise.all([
    supabase.from("players").select("id,name").order("name"),
    supabase.from("games").select("player_a1,player_a2,player_b1,player_b2"),
    supabase.from("teams").select("player_1_id,player_2_id"),
  ]);

  if (playersResult.error) throw new Error(playersResult.error.message);
  if (gamesResult.error) throw new Error(gamesResult.error.message);
  if (teamsResult.error) throw new Error(teamsResult.error.message);

  const players = (playersResult.data ?? []) as Pick<Player, "id" | "name">[];
  const games = (gamesResult.data ?? []) as Array<{
    player_a1: string;
    player_a2: string;
    player_b1: string;
    player_b2: string;
  }>;
  const teams = (teamsResult.data ?? []) as Array<{
    player_1_id: string;
    player_2_id: string;
  }>;

  const gamesCountByPlayerId = new Map<string, number>();
  const teamsCountByPlayerId = new Map<string, number>();

  for (const game of games) {
    const playerIds = [game.player_a1, game.player_a2, game.player_b1, game.player_b2];
    for (const playerId of playerIds) {
      const count = gamesCountByPlayerId.get(playerId) ?? 0;
      gamesCountByPlayerId.set(playerId, count + 1);
    }
  }

  for (const team of teams) {
    for (const playerId of [team.player_1_id, team.player_2_id]) {
      const count = teamsCountByPlayerId.get(playerId) ?? 0;
      teamsCountByPlayerId.set(playerId, count + 1);
    }
  }

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    gamesCount: gamesCountByPlayerId.get(player.id) ?? 0,
    teamsCount: teamsCountByPlayerId.get(player.id) ?? 0,
  }));
}

async function getAdminTeams(): Promise<AdminTeamRow[]> {
  assertSupabaseEnv();
  const [playersResult, teamsResult, gamesResult] = await Promise.all([
    supabase.from("players").select("id,name"),
    supabase.from("teams").select("id,name,player_1_id,player_2_id").order("name"),
    supabase.from("games").select("team_a_id,team_b_id"),
  ]);

  if (playersResult.error) throw new Error(playersResult.error.message);
  if (teamsResult.error) throw new Error(teamsResult.error.message);
  if (gamesResult.error) throw new Error(gamesResult.error.message);

  const players = (playersResult.data ?? []) as Pick<Player, "id" | "name">[];
  const teams = (teamsResult.data ?? []) as Team[];
  const games = (gamesResult.data ?? []) as Array<{ team_a_id: string; team_b_id: string }>;

  const namesById = new Map(players.map((player) => [player.id, player.name]));
  const gamesCountByTeamId = new Map<string, number>();

  for (const game of games) {
    for (const teamId of [game.team_a_id, game.team_b_id]) {
      const count = gamesCountByTeamId.get(teamId) ?? 0;
      gamesCountByTeamId.set(teamId, count + 1);
    }
  }

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    playersLabel: `${namesById.get(team.player_1_id) ?? "Unknown"} + ${
      namesById.get(team.player_2_id) ?? "Unknown"
    }`,
    gamesCount: gamesCountByTeamId.get(team.id) ?? 0,
  }));
}

export default async function AdminPage() {
  const isAdmin = await isAdminAuthenticated();
  const games = isAdmin ? await getAdminGames() : [];
  const players = isAdmin ? await getAdminPlayers() : [];
  const teams = isAdmin ? await getAdminTeams() : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-3 py-6 sm:px-6 sm:py-10">
      <header className="brut-panel space-y-2.5">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          Admin
        </h1>
      </header>

      {isAdmin ? (
        <>
          <AdminTeamsTable teams={teams} />
          <AdminPlayersTable players={players} />
          <AdminGamesTable games={games} />
        </>
      ) : (
        <AdminLoginForm />
      )}
    </main>
  );
}
