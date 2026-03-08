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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-3 py-6 sm:px-6 sm:py-10">
      <header className="brut-panel space-y-3">
        <Link href="/" className="brut-link">
          ← Back to Leaderboard
        </Link>
        <h1 className="text-4xl font-black uppercase leading-none sm:text-5xl">Start Game</h1>
        <p className="text-sm font-bold">
          Pick two players per team. New names are created automatically.
        </p>
      </header>
      <GameForm players={players} />
    </main>
  );
}
