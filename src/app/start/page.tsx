import Link from "next/link";
import { GameForm } from "@/components/GameForm";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getPlayers() {
  assertSupabaseEnv();
  const { data, error } = await supabase.from("players").select("id,name").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function StartPage() {
  const players = await getPlayers();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back to Leaderboard
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Start Game</h1>
        <p className="text-sm text-zinc-600">Pick two players per team. New names are created automatically.</p>
      </header>
      <GameForm players={players} />
    </main>
  );
}
