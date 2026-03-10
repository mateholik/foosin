import { notFound } from "next/navigation";
import { ScoreForm } from "@/components/ScoreForm";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

type SearchParams = {
  teamAId?: string;
  teamAName?: string;
  playerA1?: string;
  playerA2?: string;
  teamBId?: string;
  teamBName?: string;
  playerB1?: string;
  playerB2?: string;
};

export const dynamic = "force-dynamic";

async function getPlayersByIds(ids: string[]) {
  assertSupabaseEnv();
  const { data, error } = await supabase.from("players").select("id,name").in("id", ids);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function FinishPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const teamAId = resolvedSearchParams.teamAId;
  const teamAName = resolvedSearchParams.teamAName;
  const playerA1 = resolvedSearchParams.playerA1;
  const playerA2 = resolvedSearchParams.playerA2;
  const teamBId = resolvedSearchParams.teamBId;
  const teamBName = resolvedSearchParams.teamBName;
  const playerB1 = resolvedSearchParams.playerB1;
  const playerB2 = resolvedSearchParams.playerB2;

  const ids = [teamAId, playerA1, playerA2, teamBId, playerB1, playerB2, teamAName, teamBName];
  if (ids.some((id) => !id)) {
    notFound();
  }

  const players = await getPlayersByIds([playerA1!, playerA2!, playerB1!, playerB2!]);
  const namesById = new Map(players.map((player) => [player.id, player.name]));

  const teamAPlayersLabel = `${namesById.get(playerA1!)} + ${namesById.get(playerA2!)}`;
  const teamBPlayersLabel = `${namesById.get(playerB1!)} + ${namesById.get(playerB2!)}`;
  if (teamAPlayersLabel.includes("undefined") || teamBPlayersLabel.includes("undefined")) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-3 py-5 sm:gap-5 sm:px-6 sm:py-8">
      <header className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Finish Game</h1>
      </header>
      <ScoreForm
        teamAId={teamAId!}
        playerA1={playerA1!}
        playerA2={playerA2!}
        teamAName={teamAName!}
        teamAPlayersLabel={teamAPlayersLabel}
        teamBId={teamBId!}
        playerB1={playerB1!}
        playerB2={playerB2!}
        teamBName={teamBName!}
        teamBPlayersLabel={teamBPlayersLabel}
      />
    </main>
  );
}
