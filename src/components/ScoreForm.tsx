"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ScoreFormProps = {
  playerA1: string;
  playerA2: string;
  playerB1: string;
  playerB2: string;
  teamALabel: string;
  teamBLabel: string;
};

export function ScoreForm({
  playerA1,
  playerA2,
  playerB1,
  playerB2,
  teamALabel,
  teamBLabel,
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
          playerA1,
          playerA2,
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
    <form onSubmit={submit} className="brut-panel space-y-7">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-zinc-900">{teamALabel}</p>
        <p className="text-sm text-zinc-500">vs</p>
        <p className="text-lg font-semibold text-zinc-900">{teamBLabel}</p>
      </div>

      <div className="grid gap-4">
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Team A Score</span>
          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
            className="brut-input text-2xl font-semibold"
          />
        </label>
        <span className="text-center text-2xl font-semibold text-zinc-400">-</span>
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Team B Score</span>
          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
            className="brut-input text-2xl font-semibold"
          />
        </label>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

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
