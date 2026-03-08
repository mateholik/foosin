"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminPlayerRow = {
  id: string;
  name: string;
  gamesCount: number;
};

type AdminPlayersTableProps = {
  players: AdminPlayerRow[];
};

export function AdminPlayersTable({ players }: AdminPlayersTableProps) {
  const router = useRouter();
  const [busyPlayerId, setBusyPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const onRename = async (event: FormEvent<HTMLFormElement>, playerId: string) => {
    event.preventDefault();
    setError("");
    setBusyPlayerId(playerId);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      setError("Name is required.");
      setBusyPlayerId(null);
      return;
    }

    try {
      const response = await fetch(`/api/admin/players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Rename failed.");
      }
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Rename failed.";
      setError(message);
      setBusyPlayerId(null);
    }
  };

  const onDelete = async (playerId: string) => {
    const confirmed = window.confirm("Delete this player?");
    if (!confirmed) return;

    setError("");
    setBusyPlayerId(playerId);
    try {
      const response = await fetch(`/api/admin/players/${playerId}`, {
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
      setBusyPlayerId(null);
    }
  };

  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Manage Players</h2>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {players.length === 0 ? (
        <p className="text-sm text-zinc-600">No players found.</p>
      ) : (
        <div className="space-y-3">
          {players.map((player) => {
            const isUsed = player.gamesCount > 0;
            const isBusy = busyPlayerId === player.id;
            return (
              <form
                key={player.id}
                onSubmit={(event) => onRename(event, player.id)}
                className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 lg:grid-cols-[1.1fr_1fr_auto_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{player.name}</p>
                  <p className="text-xs text-zinc-500">
                    {player.gamesCount} game{player.gamesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Rename
                  </span>
                  <input
                    type="text"
                    name="name"
                    defaultValue={player.name}
                    className="brut-input"
                    required
                  />
                </label>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="brut-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={isBusy || isUsed}
                  onClick={() => onDelete(player.id)}
                  className="brut-btn-danger disabled:cursor-not-allowed disabled:opacity-60"
                  title={isUsed ? "Cannot delete player with existing games." : "Delete player"}
                >
                  Delete
                </button>
              </form>
            );
          })}
        </div>
      )}
    </section>
  );
}
