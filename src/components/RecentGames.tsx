import type { RecentGameRow } from "@/lib/stats";

type RecentGamesProps = {
  games: RecentGameRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function RecentGames({ games }: RecentGamesProps) {
  return (
    <section className="brut-panel space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">Recent Games</h2>
      {games.length === 0 ? (
        <p className="text-sm text-slate-300">No games have been submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {games.map((game) => (
            <li key={game.id} className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {formatDate(game.createdAt)}
              </p>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100 sm:text-base">{game.teamA}</p>
                  <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">{game.teamAPlayers}</p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-sm font-bold ${
                    game.scoreA > game.scoreB
                      ? "border border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                      : "border border-rose-400/30 bg-rose-400/15 text-rose-200"
                  }`}
                >
                  {game.scoreA}
                </span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100 sm:text-base">{game.teamB}</p>
                  <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">{game.teamBPlayers}</p>
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-sm font-bold ${
                    game.scoreB > game.scoreA
                      ? "border border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                      : "border border-rose-400/30 bg-rose-400/15 text-rose-200"
                  }`}
                >
                  {game.scoreB}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
