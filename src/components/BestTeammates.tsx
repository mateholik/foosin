import type { TeammateRow } from "@/lib/stats";

type BestTeammatesProps = {
  rows: TeammateRow[];
};

export function BestTeammates({ rows }: BestTeammatesProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-3xl font-black uppercase leading-none">Best Teammates</h2>
      {rows.length === 0 ? (
        <p className="text-sm font-bold">No teammate trends yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.pairKey}
              className="border-4 border-black bg-zinc-100 p-3 sm:flex sm:items-center sm:justify-between"
            >
              <p className="text-base font-black">{row.team}</p>
              <p className="text-sm font-bold">
                {row.wins}W / {row.losses}L ({Math.round(row.winRate * 100)}%)
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
