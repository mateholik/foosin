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
              <p className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-100 sm:text-base">
                <span className="truncate">{game.teamA}</span>
                <span className="rounded-md border border-white/15 bg-black/20 px-2.5 py-1 text-sm font-bold text-slate-100">
                  {game.scoreA}
                </span>
              </p>
              <p className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-100 sm:text-base">
                <span className="truncate">{game.teamB}</span>
                <span className="rounded-md border border-white/15 bg-black/20 px-2.5 py-1 text-sm font-bold text-slate-100">
                  {game.scoreB}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
