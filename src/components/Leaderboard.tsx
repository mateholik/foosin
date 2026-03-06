import type { LeaderboardRow } from "@/lib/stats";

type LeaderboardProps = {
  rows: LeaderboardRow[];
};

export function Leaderboard({ rows }: LeaderboardProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight">Leaderboard</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No games yet. Start one to see rankings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-600">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Player</th>
                <th className="pb-3 pr-4 font-medium">W / L</th>
                <th className="pb-3 pr-4 font-medium">Games</th>
                <th className="pb-3 font-medium">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.playerId} className="border-b border-zinc-100 last:border-0">
                  <td className="py-3 pr-4 text-zinc-500">{index + 1}</td>
                  <td className="py-3 pr-4 font-medium">{row.name}</td>
                  <td className="py-3 pr-4">
                    {row.wins}W / {row.losses}L
                  </td>
                  <td className="py-3 pr-4">{row.gamesPlayed}</td>
                  <td className="py-3">{Math.round(row.winRate * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
