"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminTeamRow = {
  id: string;
  name: string;
  playersLabel: string;
  gamesCount: number;
};

type AdminTeamsTableProps = {
  teams: AdminTeamRow[];
};

export function AdminTeamsTable({ teams }: AdminTeamsTableProps) {
  const router = useRouter();
  const [busyTeamId, setBusyTeamId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const onRename = async (event: FormEvent<HTMLFormElement>, teamId: string) => {
    event.preventDefault();
    setError("");
    setBusyTeamId(teamId);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      setError("Team name is required.");
      setBusyTeamId(null);
      return;
    }

    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
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
      setBusyTeamId(null);
    }
  };

  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-100">Manage Teams</h2>
      {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

      {teams.length === 0 ? (
        <p className="text-sm text-slate-300">No teams found.</p>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => {
            const isBusy = busyTeamId === team.id;
            return (
              <form
                key={team.id}
                onSubmit={(event) => onRename(event, team.id)}
                className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1.2fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{team.name}</p>
                  <p className="text-xs text-slate-400">{team.playersLabel}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {team.gamesCount} game{team.gamesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Rename
                  </span>
                  <input
                    type="text"
                    name="name"
                    defaultValue={team.name}
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
              </form>
            );
          })}
        </div>
      )}
    </section>
  );
}
