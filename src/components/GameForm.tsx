"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Player } from "@/lib/supabase";
import { PlayerSelect } from "@/components/PlayerSelect";
import { TeamSelect, type TeamOption } from "@/components/TeamSelect";

type GameFormProps = {
  players: Pick<Player, "id" | "name">[];
  teams: TeamOption[];
};

type PreparedTeamsResponse = {
  teams: Array<{
    id: string;
    name: string;
    playerIds: [string, string];
  }>;
};

function normalizeName(value: string) {
  return value.trim();
}

export function GameForm({ players, teams }: GameFormProps) {
  const router = useRouter();
  const [teamAName, setTeamAName] = useState("");
  const [teamA1, setTeamA1] = useState("");
  const [teamA2, setTeamA2] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamB1, setTeamB1] = useState("");
  const [teamB2, setTeamB2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedPlayers = useMemo(
    () => [...players].sort((first, second) => first.name.localeCompare(second.name)),
    [players]
  );
  const teamByName = useMemo(
    () => new Map(teams.map((team) => [team.name.toLowerCase(), team])),
    [teams]
  );
  const selectedTeamA = teamByName.get(normalizeName(teamAName).toLowerCase());
  const selectedTeamB = teamByName.get(normalizeName(teamBName).toLowerCase());

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedTeamAName = normalizeName(teamAName);
    const normalizedTeamBName = normalizeName(teamBName);
    if (!normalizedTeamAName || !normalizedTeamBName) {
      toast.error("Both team names are required.");
      return;
    }

    if (normalizedTeamAName.toLowerCase() === normalizedTeamBName.toLowerCase()) {
      toast.error("Team names must be different.");
      return;
    }

    const teamAPlayers = selectedTeamA
      ? undefined
      : [normalizeName(teamA1), normalizeName(teamA2)];
    const teamBPlayers = selectedTeamB
      ? undefined
      : [normalizeName(teamB1), normalizeName(teamB2)];

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/teams/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teams: [
            { name: normalizedTeamAName, playerNames: teamAPlayers },
            { name: normalizedTeamBName, playerNames: teamBPlayers },
          ],
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to prepare teams");
      }

      const data = (await response.json()) as PreparedTeamsResponse;
      const [resolvedTeamA, resolvedTeamB] = data.teams;
      toast.success("Teams prepared.");

      const params = new URLSearchParams({
        teamAId: resolvedTeamA.id,
        teamAName: resolvedTeamA.name,
        playerA1: resolvedTeamA.playerIds[0],
        playerA2: resolvedTeamA.playerIds[1],
        teamBId: resolvedTeamB.id,
        teamBName: resolvedTeamB.name,
        playerB1: resolvedTeamB.playerIds[0],
        playerB2: resolvedTeamB.playerIds[1],
      });
      router.push(`/finish?${params.toString()}`);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Could not start game. Try again.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="brut-panel space-y-5 sm:space-y-6">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">Team A</h2>
        <div className="grid gap-4">
          <TeamSelect id="teamAName" label="team (add or choose)" teams={teams} value={teamAName} onChange={setTeamAName} />
          {selectedTeamA ? (
            <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-slate-300">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Players</p>
              <p className="mt-1 font-medium text-slate-100">
                {selectedTeamA.playerNames[0]} + {selectedTeamA.playerNames[1]}
              </p>
            </div>
          ) : (
            <>
              <PlayerSelect
                id="teamA1"
                label="Player A1 (Add or choose)"
                players={sortedPlayers}
                value={teamA1}
                onChange={setTeamA1}
              />
              <PlayerSelect
                id="teamA2"
                label="Player A2 (Add or choose)"
                players={sortedPlayers}
                value={teamA2}
                onChange={setTeamA2}
              />
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-100 sm:text-xl">Team B</h2>
        <div className="grid gap-4">
          <TeamSelect id="teamBName" label="team (add or choose)" teams={teams} value={teamBName} onChange={setTeamBName} />
          {selectedTeamB ? (
            <div className="rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-slate-300">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Players</p>
              <p className="mt-1 font-medium text-slate-100">
                {selectedTeamB.playerNames[0]} + {selectedTeamB.playerNames[1]}
              </p>
            </div>
          ) : (
            <>
              <PlayerSelect
                id="teamB1"
                label="Player B1 (Add or choose)"
                players={sortedPlayers}
                value={teamB1}
                onChange={setTeamB1}
              />
              <PlayerSelect
                id="teamB2"
                label="Player B2 (Add or choose)"
                players={sortedPlayers}
                value={teamB2}
                onChange={setTeamB2}
              />
            </>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="brut-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Starting..." : "Start Game"}
      </button>
    </form>
  );
}
