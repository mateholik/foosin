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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-3 py-5 sm:gap-5 sm:px-6 sm:py-8">
      <header className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Start Game
        </h1>
      </header>
      <GameForm players={players} />
    </main>
  );
}
