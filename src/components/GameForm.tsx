"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Player } from "@/lib/supabase";
import { PlayerSelect } from "@/components/PlayerSelect";

type GameFormProps = {
  players: Pick<Player, "id" | "name">[];
};

type PlayersResponse = {
  players: Array<{
    id: string;
    name: string;
  }>;
};

function normalizeName(value: string) {
  return value.trim();
}

export function GameForm({ players }: GameFormProps) {
  const router = useRouter();
  const [teamA1, setTeamA1] = useState("");
  const [teamA2, setTeamA2] = useState("");
  const [teamB1, setTeamB1] = useState("");
  const [teamB2, setTeamB2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sortedPlayers = useMemo(
    () => [...players].sort((first, second) => first.name.localeCompare(second.name)),
    [players]
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const names = [teamA1, teamA2, teamB1, teamB2].map(normalizeName);
    if (names.some((name) => !name)) {
      setError("All four player slots are required.");
      return;
    }

    const uniqueNames = new Set(names.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== 4) {
      setError("Pick four distinct players.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names }),
      });

      if (!response.ok) {
        throw new Error("Failed to prepare players");
      }

      const data = (await response.json()) as PlayersResponse;
      const ids = new Map(data.players.map((player) => [player.name.toLowerCase(), player.id]));

      const playerA1 = ids.get(names[0].toLowerCase());
      const playerA2 = ids.get(names[1].toLowerCase());
      const playerB1 = ids.get(names[2].toLowerCase());
      const playerB2 = ids.get(names[3].toLowerCase());

      if (!playerA1 || !playerA2 || !playerB1 || !playerB2) {
        throw new Error("Failed to resolve player IDs");
      }

      const params = new URLSearchParams({
        playerA1,
        playerA2,
        playerB1,
        playerB2,
      });
      router.push(`/finish?${params.toString()}`);
    } catch {
      setError("Could not start game. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="brut-panel space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase">Team A</h2>
        <div className="grid gap-4">
          <PlayerSelect
            id="teamA1"
            label="Player A1"
            players={sortedPlayers}
            value={teamA1}
            onChange={setTeamA1}
          />
          <PlayerSelect
            id="teamA2"
            label="Player A2"
            players={sortedPlayers}
            value={teamA2}
            onChange={setTeamA2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase">Team B</h2>
        <div className="grid gap-4">
          <PlayerSelect
            id="teamB1"
            label="Player B1"
            players={sortedPlayers}
            value={teamB1}
            onChange={setTeamB1}
          />
          <PlayerSelect
            id="teamB2"
            label="Player B2"
            players={sortedPlayers}
            value={teamB2}
            onChange={setTeamB2}
          />
        </div>
      </div>

      {error ? <p className="text-sm font-black text-red-700">{error}</p> : null}

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
