"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminGameRow = {
  id: string;
  teamA: string;
  teamB: string;
  teamAPlayers: string;
  teamBPlayers: string;
  scoreA: number;
  scoreB: number;
  createdAt: string;
};

type AdminGamesTableProps = {
  games: AdminGameRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminGamesTable({ games }: AdminGamesTableProps) {
  const router = useRouter();
  const [busyGameId, setBusyGameId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const onSave = async (event: FormEvent<HTMLFormElement>, gameId: string) => {
    event.preventDefault();
    setError("");
    setBusyGameId(gameId);

    const formData = new FormData(event.currentTarget);
    const scoreA = Number(formData.get("scoreA"));
    const scoreB = Number(formData.get("scoreB"));

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoreA, scoreB }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Update failed.");
      }
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Update failed.";
      setError(message);
      setBusyGameId(null);
    }
  };

  const onDelete = async (gameId: string) => {
    const confirmed = window.confirm("Delete this game?");
    if (!confirmed) return;

    setError("");
    setBusyGameId(gameId);
    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Delete failed.");
      }
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Delete failed.";
      setError(message);
      setBusyGameId(null);
    }
  };

  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Manage Games</h2>
      {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

      {games.length === 0 ? (
        <p className="text-sm text-slate-300">No games found.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <form
              key={game.id}
              onSubmit={(event) => onSave(event, game.id)}
              className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1.5fr_1fr_1fr_auto_auto]"
            >
              <div>
                <p className="text-sm font-semibold text-slate-100">{game.teamA}</p>
                <p className="text-xs text-slate-400">{game.teamAPlayers}</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">vs {game.teamB}</p>
                <p className="text-xs text-slate-400">{game.teamBPlayers}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  {formatDate(game.createdAt)}
                </p>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Score A
                </span>
                <input
                  type="number"
                  name="scoreA"
                  min={0}
                  defaultValue={game.scoreA}
                  className="brut-input"
                  required
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Score B
                </span>
                <input
                  type="number"
                  name="scoreB"
                  min={0}
                  defaultValue={game.scoreB}
                  className="brut-input"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={busyGameId === game.id}
                className="brut-btn-primary h-11 min-w-24 self-end disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => onDelete(game.id)}
                disabled={busyGameId === game.id}
                className="brut-btn-danger h-11 min-w-24 self-end disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete
              </button>
            </form>
          ))}
        </div>
      )}
    </section>
  );
}
