import Link from "next/link";
import { BestTeammates } from "@/components/BestTeammates";
import { Leaderboard } from "@/components/Leaderboard";
import { RecentGames } from "@/components/RecentGames";
import { assertSupabaseEnv, supabase, type Game, type Player } from "@/lib/supabase";
import { computeBestTeammates, computeLeaderboard, computeRecentGames } from "@/lib/stats";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  assertSupabaseEnv();
  const [playersResult, gamesResult] = await Promise.all([
    supabase.from("players").select("id,name,created_at").order("name"),
    supabase.from("games").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  if (playersResult.error) {
    throw new Error(playersResult.error.message);
  }
  if (gamesResult.error) {
    throw new Error(gamesResult.error.message);
  }

  const players = (playersResult.data ?? []) as Player[];
  const games = (gamesResult.data ?? []) as Game[];
  return { players, games };
}

export default async function HomePage() {
  const { players, games } = await getDashboardData();
  const leaderboardRows = computeLeaderboard(players, games);
  const recentGames = computeRecentGames(players, games);
  const teammateRows = computeBestTeammates(players, games);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Foosball Tracker</h1>
          <p className="mt-2 text-sm text-zinc-600">Track 2v2 match outcomes and standings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Admin
          </Link>
          <Link
            href="/start"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Start Game
          </Link>
        </div>
      </header>

      <Leaderboard rows={leaderboardRows} />
      <RecentGames games={recentGames} />
      <BestTeammates rows={teammateRows} />
    </main>
  );
}
