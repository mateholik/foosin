import Link from "next/link";
import { AdminGamesTable } from "@/components/AdminGamesTable";
import { AdminLoginForm } from "@/components/AdminLoginForm";
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

export default async function AdminPage() {
  const isAdmin = await isAdminAuthenticated();
  const games = isAdmin ? await getAdminGames() : [];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-3 py-6 sm:px-6 sm:py-10">
      <header className="brut-panel space-y-3">
        <Link href="/" className="brut-link">
          ← Back to Leaderboard
        </Link>
        <h1 className="text-4xl font-black uppercase leading-none sm:text-5xl">Admin</h1>
        <p className="text-sm font-bold">Edit or delete games with the shared admin password.</p>
      </header>

      {isAdmin ? <AdminGamesTable games={games} /> : <AdminLoginForm />}
    </main>
  );
}
