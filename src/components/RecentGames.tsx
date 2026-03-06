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
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight">Recent Games</h2>
      {games.length === 0 ? (
        <p className="text-sm text-zinc-500">No games have been submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 px-3 py-2"
            >
              <span className="font-medium">
                {game.teamA} {game.scoreA} : {game.scoreB} {game.teamB}
              </span>
              <span className="text-xs text-zinc-500">{formatDate(game.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
