import type { TeammateRow } from "@/lib/stats";

type BestTeammatesProps = {
  rows: TeammateRow[];
};

export function BestTeammates({ rows }: BestTeammatesProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">Best Teams</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-300">No team trends yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => (
            <li
              key={row.teamId}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">#{index + 1}</p>
                <p className="mt-1 text-base font-semibold text-slate-100">{row.teamName}</p>
                <p className="mt-1 text-sm text-slate-400">{row.team}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm sm:mt-0 sm:justify-end">
                <p className="rounded-md border border-white/15 bg-black/20 px-2.5 py-1 font-medium text-slate-200">
                  {row.wins}W / {row.losses}L
                </p>
                <p className="rounded-md border border-[rgb(var(--accent-rgb))/30] bg-[rgb(var(--accent-rgb))/10] px-2.5 py-1 font-semibold text-[rgb(var(--accent-rgb))]">
                  {Math.round(row.winRate * 100)}% win rate
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
