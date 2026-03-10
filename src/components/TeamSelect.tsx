"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export type TeamOption = {
  id: string;
  name: string;
  playerNames: [string, string];
};

type TeamSelectProps = {
  id: string;
  label: string;
  teams: TeamOption[];
  value: string;
  onChange: (value: string) => void;
};

export function TeamSelect({ id, label, teams, value, onChange }: TeamSelectProps) {
  const safeValue = value ?? "";
  const query = safeValue.trim().toLowerCase();
  const filteredTeams = !query
    ? teams
    : teams.filter((team) => team.name.toLowerCase().includes(query));

  const hasExactMatch = teams.some((team) => team.name.toLowerCase() === query);

  return (
    <label htmlFor={id} className="relative block space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <Combobox value={safeValue} onChange={(nextValue) => onChange(nextValue ?? "")} immediate>
        <ComboboxInput
          id={id}
          aria-label={label}
          value={safeValue}
          onChange={(event) => onChange(event.target.value ?? "")}
          placeholder="Search or type a team"
          className="brut-input"
          autoComplete="off"
        />
        <ComboboxOptions
          anchor="bottom"
          transition
          className="z-20 mt-2 max-h-60 w-[var(--input-width)] overflow-auto rounded-xl border border-white/10 bg-[#171d2b] p-1 shadow-xl [--anchor-gap:4px] empty:invisible transition duration-100 data-[closed]:opacity-0"
        >
          {filteredTeams.map((team) => (
            <ComboboxOption
              key={team.id}
              value={team.name}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-200 data-[focus]:bg-[rgba(237,241,64,0.18)] data-[focus]:text-white"
            >
              <span className="block font-medium">{team.name}</span>
              <span className="block text-xs text-slate-400">
                {team.playerNames[0]} + {team.playerNames[1]}
              </span>
            </ComboboxOption>
          ))}
          {safeValue.trim() && !hasExactMatch ? (
            <ComboboxOption
              value={safeValue.trim()}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-200 data-[focus]:bg-[rgba(237,241,64,0.18)] data-[focus]:text-white"
            >
              Use &quot;{safeValue.trim()}&quot; (new team)
            </ComboboxOption>
          ) : null}
        </ComboboxOptions>
      </Combobox>
    </label>
  );
}
