"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AdminPlayerRow = {
  id: string;
  name: string;
  gamesCount: number;
  teamsCount: number;
};

type AdminPlayersTableProps = {
  players: AdminPlayerRow[];
};

export function AdminPlayersTable({ players }: AdminPlayersTableProps) {
  const router = useRouter();
  const [busyPlayerId, setBusyPlayerId] = useState<string | null>(null);

  const onRename = async (event: FormEvent<HTMLFormElement>, playerId: string) => {
    event.preventDefault();
    setBusyPlayerId(playerId);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      toast.error("Name is required.");
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
      toast.success("Player updated.");
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Rename failed.";
      toast.error(message);
      setBusyPlayerId(null);
    }
  };

  const onDelete = async (playerId: string, hasReferences: boolean) => {
    if (hasReferences) {
      toast.error("Cannot delete player with existing games or teams.");
      return;
    }

    const confirmed = window.confirm("Delete this player?");
    if (!confirmed) return;

    setBusyPlayerId(playerId);
    try {
      const response = await fetch(`/api/admin/players/${playerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Delete failed.");
      }
      toast.success("Player deleted.");
      router.refresh();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Delete failed.";
      toast.error(message);
      setBusyPlayerId(null);
    }
  };

  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Manage Players</h2>

      {players.length === 0 ? (
        <p className="text-sm text-slate-300">No players found.</p>
      ) : (
        <div className="space-y-3">
          {players.map((player) => {
            const hasReferences = player.gamesCount > 0 || player.teamsCount > 0;
            const isBusy = busyPlayerId === player.id;
            return (
              <form
                key={player.id}
                onSubmit={(event) => onRename(event, player.id)}
                className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1.1fr_1fr_auto_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{player.name}</p>
                  <p className="text-xs text-slate-400">
                    {player.gamesCount} game{player.gamesCount === 1 ? "" : "s"} • {player.teamsCount} team
                    {player.teamsCount === 1 ? "" : "s"}
                  </p>
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                  className="brut-btn-primary h-11 min-w-24 self-end disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onDelete(player.id, hasReferences)}
                  className="brut-btn-danger h-11 min-w-24 self-end disabled:cursor-not-allowed disabled:opacity-60"
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
