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
      <h2 className="text-3xl font-black uppercase leading-none">Recent Games</h2>
      {games.length === 0 ? (
        <p className="text-sm font-bold">No games have been submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {games.map((game) => (
            <li
              key={game.id}
              className="border-4 border-black bg-zinc-100 p-3"
            >
              <p className="text-sm font-black sm:text-base">
                {game.teamA} {game.scoreA} : {game.scoreB} {game.teamB}
              </p>
              <p className="mt-1 text-xs font-bold uppercase">{formatDate(game.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
