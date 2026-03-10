"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ScoreFormProps = {
  teamAId: string;
  playerA1: string;
  playerA2: string;
  teamAName: string;
  teamAPlayersLabel: string;
  teamBId: string;
  playerB1: string;
  playerB2: string;
  teamBName: string;
  teamBPlayersLabel: string;
};

export function ScoreForm({
  teamAId,
  playerA1,
  playerA2,
  teamAName,
  teamAPlayersLabel,
  teamBId,
  playerB1,
  playerB2,
  teamBName,
  teamBPlayersLabel,
}: ScoreFormProps) {
  const router = useRouter();
  const [scoreA, setScoreA] = useState("10");
  const [scoreB, setScoreB] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const parsedScoreA = Number(scoreA);
    const parsedScoreB = Number(scoreB);
    const invalidScore =
      Number.isNaN(parsedScoreA) ||
      Number.isNaN(parsedScoreB) ||
      parsedScoreA < 0 ||
      parsedScoreB < 0 ||
      parsedScoreA === parsedScoreB;
    if (invalidScore) {
      setError("Enter valid non-tied scores.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAId,
          teamAName,
          playerA1,
          playerA2,
          teamBId,
          teamBName,
          playerB1,
          playerB2,
          scoreA: parsedScoreA,
          scoreB: parsedScoreB,
        }),
      });

      if (!response.ok) throw new Error("Failed to save game");
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not submit score. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="brut-panel space-y-5 sm:space-y-6">
      <div className="space-y-2 rounded-xl border border-white/10 bg-black/10 p-3">
        <p className="text-base font-semibold text-slate-100 sm:text-lg">{teamAName}</p>
        <p className="text-sm text-slate-400">{teamAPlayersLabel}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">vs</p>
        <p className="text-base font-semibold text-slate-100 sm:text-lg">{teamBName}</p>
        <p className="text-sm text-slate-400">{teamBPlayersLabel}</p>
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Team A Score</span>
          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
            className="brut-input"
          />
        </label>
        <span className="text-center text-xl font-semibold text-slate-500">-</span>
        <label className="block space-y-2">
          <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">Team B Score</span>
          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
            className="brut-input"
          />
        </label>
      </div>

      {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="brut-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Submit Score"}
      </button>
    </form>
  );
}
