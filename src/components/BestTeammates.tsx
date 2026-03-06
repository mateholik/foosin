import type { TeammateRow } from "@/lib/stats";

type BestTeammatesProps = {
  rows: TeammateRow[];
};

export function BestTeammates({ rows }: BestTeammatesProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight">Best Teammates</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No teammate trends yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.pairKey}
              className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2"
            >
              <span className="font-medium">{row.team}</span>
              <span className="text-sm">
                {row.wins}W / {row.losses}L ({Math.round(row.winRate * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
