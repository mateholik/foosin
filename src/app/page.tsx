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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-5 px-3 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-32">
      <Leaderboard rows={leaderboardRows} />
      <RecentGames games={recentGames} />
      <BestTeammates rows={teammateRows} />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-5xl p-3 sm:p-6">
        <Link href="/start" className="brut-btn-primary pointer-events-auto w-full text-lg">
          Start Game
        </Link>
      </div>
    </main>
  );
}
