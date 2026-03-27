import { GameForm } from "@/components/GameForm";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { type Player, type Team } from "@/lib/supabase";
import type { TeamOption } from "@/components/TeamSelect";

export const dynamic = "force-dynamic";

async function getPlayers() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("players").select("id,name").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Pick<Player, "id" | "name">[];
}

async function getTeams() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("teams").select("id,name,player_1_id,player_2_id");
  if (error) throw new Error(error.message);
  return (data ?? []) as Team[];
}

export default async function StartPage() {
  const [players, teams] = await Promise.all([getPlayers(), getTeams()]);
  const playersById = new Map(players.map((player) => [player.id, player.name]));
  const teamOptions: TeamOption[] = teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      playerNames: [
        playersById.get(team.player_1_id) ?? "Unknown",
        playersById.get(team.player_2_id) ?? "Unknown",
      ] as [string, string],
    }))
    .sort((first, second) => first.name.localeCompare(second.name));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-3 py-5 sm:gap-5 sm:px-6 sm:py-8">
      <header className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Start Game
        </h1>
      </header>
      <GameForm players={players} teams={teamOptions} />
    </main>
  );
}
