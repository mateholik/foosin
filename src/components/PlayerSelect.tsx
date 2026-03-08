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
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        id={id}
        list={`${id}-players`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Select or type a player"
        className="brut-input"
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
