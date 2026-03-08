import Link from "next/link";
import { AdminGamesTable } from "@/components/AdminGamesTable";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminPlayersTable } from "@/components/AdminPlayersTable";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { assertSupabaseEnv, type Game, type Player, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type AdminGameRow = {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  createdAt: string;
};

type AdminPlayerRow = {
  id: string;
  name: string;
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
    teamA: `${namesById.get(game.player_a1) ?? "Unknown"} + ${
      namesById.get(game.player_a2) ?? "Unknown"
    }`,
    teamB: `${namesById.get(game.player_b1) ?? "Unknown"} + ${
      namesById.get(game.player_b2) ?? "Unknown"
    }`,
    scoreA: game.score_a,
    scoreB: game.score_b,
    createdAt: game.created_at,
  }));
}

async function getAdminPlayers(): Promise<AdminPlayerRow[]> {
  assertSupabaseEnv();
  const [playersResult, gamesResult] = await Promise.all([
    supabase.from("players").select("id,name").order("name"),
    supabase.from("games").select("player_a1,player_a2,player_b1,player_b2"),
  ]);

  if (playersResult.error) throw new Error(playersResult.error.message);
  if (gamesResult.error) throw new Error(gamesResult.error.message);

  const players = (playersResult.data ?? []) as Pick<Player, "id" | "name">[];
  const games = (gamesResult.data ?? []) as Array<{
    player_a1: string;
    player_a2: string;
    player_b1: string;
    player_b2: string;
  }>;

  const gamesCountByPlayerId = new Map<string, number>();
  for (const game of games) {
    const playerIds = [game.player_a1, game.player_a2, game.player_b1, game.player_b2];
    for (const playerId of playerIds) {
      const count = gamesCountByPlayerId.get(playerId) ?? 0;
      gamesCountByPlayerId.set(playerId, count + 1);
    }
  }

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    gamesCount: gamesCountByPlayerId.get(player.id) ?? 0,
  }));
}

export default async function AdminPage() {
  const isAdmin = await isAdminAuthenticated();
  const games = isAdmin ? await getAdminGames() : [];
  const players = isAdmin ? await getAdminPlayers() : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-3 py-6 sm:px-6 sm:py-10">
      <header className="brut-panel space-y-3">
        <Link href="/" className="brut-link">
          ← Back to Leaderboard
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Admin
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Edit or delete games with the shared admin password.
        </p>
      </header>

      {isAdmin ? (
        <>
          <AdminPlayersTable players={players} />
          <AdminGamesTable games={games} />
        </>
      ) : (
        <AdminLoginForm />
      )}
    </main>
  );
}
