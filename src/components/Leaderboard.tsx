import type { LeaderboardRow } from "@/lib/stats";

type LeaderboardProps = {
  rows: LeaderboardRow[];
};

export function Leaderboard({ rows }: LeaderboardProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">Leaderboard</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-slate-300">No games yet. Start one to see rankings.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {rows.map((row, index) => (
              <li
                key={row.playerId}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="rounded-md border border-white/15 bg-black/20 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                    #{index + 1}
                  </p>
                  <p className="rounded-md border border-[rgb(var(--accent-rgb))/30] bg-[rgb(var(--accent-rgb))/10] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent-rgb))]">
                    Elo {row.rating}
                  </p>
                </div>
                <p className="mt-3 text-xl font-semibold text-slate-100">{row.name}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-slate-300">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Wins / Losses</span>
                    <span className="font-semibold text-slate-100">
                      {row.wins}W / {row.losses}L
                    </span>
                  </p>
                  <p className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-slate-300">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Games Played</span>
                    <span className="font-semibold text-slate-100">{row.gamesPlayed}</span>
                  </p>
                  <p className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-slate-300">
                    <span className="text-xs uppercase tracking-wide text-slate-400">Win Rate</span>
                    <span className="font-semibold text-slate-100">{Math.round(row.winRate * 100)}%</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide">#</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide">Player</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide">Elo</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide">W / L</th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wide">Games</th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wide">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.playerId} className="border-b border-white/10 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3 pr-4 text-base font-semibold text-slate-100">{row.name}</td>
                    <td className="py-3 pr-4 text-slate-300">{row.rating}</td>
                    <td className="py-3 pr-4 text-slate-300">
                      {row.wins}W / {row.losses}L
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{row.gamesPlayed}</td>
                    <td className="py-3 text-slate-300">{Math.round(row.winRate * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
