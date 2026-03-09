"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useMemo } from "react";
import type { Player } from "@/lib/supabase";

type PlayerSelectProps = {
  id: string;
  label: string;
  players: Pick<Player, "id" | "name">[];
  value: string;
  onChange: (value: string) => void;
};

export function PlayerSelect({ id, label, players, value, onChange }: PlayerSelectProps) {
  const safeValue = value ?? "";

  const filteredPlayers = useMemo(() => {
    const query = safeValue.trim().toLowerCase();
    if (!query) return players;
    return players.filter((player) => player.name.toLowerCase().includes(query));
  }, [players, safeValue]);

  const hasExactMatch = useMemo(() => {
    const query = safeValue.trim().toLowerCase();
    if (!query) return false;
    return players.some((player) => player.name.toLowerCase() === query);
  }, [players, safeValue]);

  return (
    <label htmlFor={id} className="relative block space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <Combobox
        value={safeValue}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        immediate
      >
        <ComboboxInput
          id={id}
          aria-label={label}
          value={safeValue}
          onChange={(event) => onChange(event.target.value ?? "")}
          placeholder="Search or type a player"
          className="brut-input"
          autoComplete="off"
        />
        <ComboboxOptions
          anchor="bottom"
          transition
          className="z-20 mt-2 max-h-60 w-[var(--input-width)] overflow-auto rounded-xl border border-white/10 bg-[#171d2b] p-1 shadow-xl [--anchor-gap:4px] empty:invisible transition duration-100 data-[closed]:opacity-0"
        >
          {filteredPlayers.map((player) => (
            <ComboboxOption
              key={player.id}
              value={player.name}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-200 data-[focus]:bg-[rgba(237,241,64,0.18)] data-[focus]:text-white"
            >
              {player.name}
            </ComboboxOption>
          ))}
          {safeValue.trim() && !hasExactMatch ? (
            <ComboboxOption
              value={safeValue.trim()}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-200 data-[focus]:bg-[rgba(237,241,64,0.18)] data-[focus]:text-white"
            >
              Use &quot;{safeValue.trim()}&quot; (new)
            </ComboboxOption>
          ) : null}
        </ComboboxOptions>
      </Combobox>
    </label>
  );
}
