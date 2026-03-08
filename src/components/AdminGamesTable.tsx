"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminGameRow = {
  id: string;
  teamA: string;
  teamB: string;
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

  const onLogout = async () => {
    setError("");
    setBusyGameId("logout");
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } catch {
      setError("Logout failed.");
      setBusyGameId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Manage Games</h2>
        <button
          type="button"
          onClick={onLogout}
          disabled={busyGameId === "logout"}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Logout
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {games.length === 0 ? (
        <p className="text-sm text-zinc-500">No games found.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <form
              key={game.id}
              onSubmit={(event) => onSave(event, game.id)}
              className="grid gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto_auto]"
            >
              <div>
                <p className="text-sm font-medium">{game.teamA}</p>
                <p className="text-xs text-zinc-500">vs {game.teamB}</p>
                <p className="mt-1 text-xs text-zinc-500">{formatDate(game.createdAt)}</p>
              </div>
              <label className="space-y-1">
                <span className="text-xs text-zinc-600">Score A</span>
                <input
                  type="number"
                  name="scoreA"
                  min={0}
                  defaultValue={game.scoreA}
                  className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm outline-none ring-emerald-500 transition focus:ring-2"
                  required
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-zinc-600">Score B</span>
                <input
                  type="number"
                  name="scoreB"
                  min={0}
                  defaultValue={game.scoreB}
                  className="w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm outline-none ring-emerald-500 transition focus:ring-2"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={busyGameId === game.id}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => onDelete(game.id)}
                disabled={busyGameId === game.id}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
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
