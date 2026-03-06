"use client";

import type { Player } from "@/lib/supabase";

type PlayerSelectProps = {
  id: string;
  label: string;
  players: Pick<Player, "id" | "name">[];
  value: string;
  onChange: (value: string) => void;
};

export function PlayerSelect({ id, label, players, value, onChange }: PlayerSelectProps) {
  return (
    <label htmlFor={id} className="space-y-1">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input
        id={id}
        list={`${id}-players`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Select or type a player"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2"
        autoComplete="off"
      />
      <datalist id={`${id}-players`}>
        {players.map((player) => (
          <option key={player.id} value={player.name} />
        ))}
      </datalist>
    </label>
  );
}
