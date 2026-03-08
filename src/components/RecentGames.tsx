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
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Recent Games</h2>
      {games.length === 0 ? (
        <p className="text-sm text-zinc-600">No games have been submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {games.map((game) => (
            <li key={game.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-medium leading-6 text-zinc-900 sm:text-base">
                {game.teamA} {game.scoreA} : {game.scoreB} {game.teamB}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                {formatDate(game.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
