export default function InfoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-3 py-5 sm:gap-5 sm:px-6 sm:py-8">
      <header className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">How Stats Work</h1>
      </header>

      <section className="brut-panel space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          Leaderboard Stats
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>Wins:</strong> +1 when your team score is higher than opponent score.
          </li>
          <li>
            <strong>Losses:</strong> +1 when your team score is lower than opponent score.
          </li>
          <li>
            <strong>Games:</strong> Number of matches you played.
          </li>
          <li>
            <strong>Win Rate:</strong> wins / games. Example: 8 wins in 10 games = 80%.
          </li>
          <li>
            <strong>Elo:</strong> Skill rating that goes up/down after each game.
          </li>
        </ul>
      </section>

      <section className="brut-panel space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          Elo
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>1) Everyone starts at 1000</strong>
          </li>
          <li>
            <strong>2) Team rating = average of both players</strong>
          </li>
          <li>
            <strong>3) Expected score formula</strong>
            <br />
            <strong>ExpectedA = 1 / (1 + 10^((TeamB - TeamA)/400))</strong>
          </li>
          <li>
            <strong>4) K-factor = 24</strong>
          </li>
          <li>
            <strong>5) Both players on a team get the same delta</strong>
          </li>
          <li className="pt-2">
            <strong>Example:</strong>
            <br />
            Alex 1100, Mike 1000 → TeamA = 1050
            <br />
            Tom 1000, John 1000 → TeamB = 1000
          </li>
          <li>
            Expected A win probability:
            <br />
            <strong>ExpectedA ≈ 0.57</strong>
          </li>
          <li>
            If A wins:
            <br />
            <strong>DeltaA = 24 × (1 - 0.57) ≈ +10.3</strong>
          </li>
          <li>
            Both players get same delta:
            <br />
            Alex +10.3, Mike +10.3, Tom -10.3, John -10.3
          </li>
          <li>
            ✔ This is the rating flow used here.
          </li>
        </ul>
      </section>

      <section className="brut-panel space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          Team Elo
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>1) Every team starts at 1000</strong>
          </li>
          <li>
            <strong>2) Games are processed oldest to newest</strong>
          </li>
          <li>
            <strong>3) Expected score formula (same as player Elo)</strong>
            <br />
            <strong>ExpectedA = 1 / (1 + 10^((TeamB - TeamA)/400))</strong>
          </li>
          <li>
            <strong>4) K-factor = 24</strong>
          </li>
          <li>
            <strong>5) Update after each match</strong>
            <br />
            Winner gains points, loser loses points.
            <br />
            Beat stronger team = bigger gain; lose to weaker team = bigger loss.
          </li>
          <li>
            <strong>6) Best Teams is sorted by team Elo</strong>
          </li>
        </ul>
      </section>

      <section className="brut-panel space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          Other Sections
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>Recent Games:</strong> Latest 10 matches, newest first.
          </li>
          <li>
            <strong>Best Teams:</strong> Team records with team Elo, sorted by highest Elo.
          </li>
        </ul>
      </section>
    </main>
  );
}
