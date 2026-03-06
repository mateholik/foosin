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
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <p className="text-lg font-semibold">{teamALabel}</p>
        <p className="text-sm text-zinc-500">vs</p>
        <p className="text-lg font-semibold">{teamBLabel}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-700">Team A Score</span>
          <input
            type="number"
            min={0}
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg outline-none ring-emerald-500 transition focus:ring-2"
          />
        </label>
        <span className="text-center text-xl font-semibold text-zinc-500">-</span>
        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-700">Team B Score</span>
          <input
            type="number"
            min={0}
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-lg outline-none ring-emerald-500 transition focus:ring-2"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Submit Score"}
      </button>
    </form>
  );
}
