import type { LeaderboardRow } from "@/lib/stats";

type LeaderboardProps = {
  rows: LeaderboardRow[];
};

export function Leaderboard({ rows }: LeaderboardProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-3xl font-black uppercase leading-none">Leaderboard</h2>
      {rows.length === 0 ? (
        <p className="text-sm font-bold">No games yet. Start one to see rankings.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {rows.map((row, index) => (
              <li key={row.playerId} className="border-4 border-black bg-zinc-100 p-3">
                <p className="text-xs font-black uppercase">#{index + 1}</p>
                <p className="mt-1 text-xl font-black">{row.name}</p>
                <div className="mt-3 space-y-1 text-sm font-bold">
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
                <tr className="border-b-4 border-black text-black">
                  <th className="pb-3 pr-4 text-xs font-black uppercase">#</th>
                  <th className="pb-3 pr-4 text-xs font-black uppercase">Player</th>
                  <th className="pb-3 pr-4 text-xs font-black uppercase">W / L</th>
                  <th className="pb-3 pr-4 text-xs font-black uppercase">Games</th>
                  <th className="pb-3 text-xs font-black uppercase">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.playerId} className="border-b-2 border-black/20 last:border-0">
                    <td className="py-3 pr-4 text-lg font-black">{index + 1}</td>
                    <td className="py-3 pr-4 text-lg font-black">{row.name}</td>
                    <td className="py-3 pr-4 font-bold">
                      {row.wins}W / {row.losses}L
                    </td>
                    <td className="py-3 pr-4 font-bold">{row.gamesPlayed}</td>
                    <td className="py-3 font-bold">{Math.round(row.winRate * 100)}%</td>
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
