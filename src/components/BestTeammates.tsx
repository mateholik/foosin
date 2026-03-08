import type { TeammateRow } from "@/lib/stats";

type BestTeammatesProps = {
  rows: TeammateRow[];
};

export function BestTeammates({ rows }: BestTeammatesProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Best Teammates</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-600">No teammate trends yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.pairKey}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex sm:items-center sm:justify-between"
            >
              <p className="text-base font-semibold text-zinc-900">{row.team}</p>
              <p className="mt-1 text-sm text-zinc-700 sm:mt-0">
                {row.wins}W / {row.losses}L ({Math.round(row.winRate * 100)}%)
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
