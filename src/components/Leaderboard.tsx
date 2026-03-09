import type { LeaderboardRow } from "@/lib/stats";

type LeaderboardProps = {
  rows: LeaderboardRow[];
};

export function Leaderboard({ rows }: LeaderboardProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Leaderboard</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-600">No games yet. Start one to see rankings.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {rows.map((row, index) => (
              <li key={row.playerId} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  #{index + 1}
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">{row.name}</p>
                <div className="mt-3 space-y-1.5 text-sm text-zinc-700">
                  <p>{row.rating} elo</p>
                  <p>{row.wins}W / {row.losses}L</p>
                  <p>{row.gamesPlayed} games</p>
                  <p>{Math.round(row.winRate * 100)}% win rate</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
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
                  <tr key={row.playerId} className="border-b border-zinc-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-zinc-500">{index + 1}</td>
                    <td className="py-3 pr-4 text-base font-semibold text-zinc-900">{row.name}</td>
                    <td className="py-3 pr-4 text-zinc-700">{row.rating}</td>
                    <td className="py-3 pr-4 text-zinc-700">
                      {row.wins}W / {row.losses}L
                    </td>
                    <td className="py-3 pr-4 text-zinc-700">{row.gamesPlayed}</td>
                    <td className="py-3 text-zinc-700">{Math.round(row.winRate * 100)}%</td>
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
