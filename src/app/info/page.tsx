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
          Player Elo
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>Everyone starts at 1000</strong>
            <br />
            All players begin with the same rating.
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            Alex 1000
            <br />
            Mike 1000
            <br />
            Tom 1000
            <br />
            John 1000
          </li>
          <li>
            Higher rating = stronger player.
          </li>
          <li>
            <strong>Team rating = average of both players</strong>
            <br />
            Since games are 2 vs 2, we first calculate the team strength.
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            Alex 1100
            <br />
            Mike 1000
            <br />
            TeamA = (1100 + 1000) / 2 = 1050
            <br />
            Tom 1000
            <br />
            John 1000
            <br />
            TeamB = (1000 + 1000) / 2 = 1000
            <br />
            Team A is slightly stronger.
          </li>
          <li>
            <strong>Expected win chance</strong>
            <br />
            The system calculates how likely a team is to win based on ratings.
          </li>
          <li>
            <strong>Formula:</strong>
            <br />
            ExpectedA = 1 / (1 + 10^((TeamB - TeamA)/400))
          </li>
          <li>
            <strong>Simple explanation:</strong>
            <br />
            compare both team ratings
            <br />
            convert the difference into a win probability
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            TeamA = 1050
            <br />
            TeamB = 1000
            <br />
            Expected chance for Team A:
            <br />
            ExpectedA ≈ 0.57
            <br />
            Meaning Team A has about a 57% chance to win.
            <br />
            The number 400 just controls how strongly rating differences affect the probability.
          </li>
          <li>
            <strong>K-factor = 24</strong>
            <br />
            This controls how fast ratings change.
            <br />
            larger number -&gt; ratings change faster
            <br />
            smaller number -&gt; ratings change slower
            <br />
            Here we use:
            <br />
            K = 24
          </li>
          <li>
            <strong>Rating change after a match</strong>
            <br />
            Formula:
            <br />
            Delta = K x (Actual - Expected)
            <br />
            Where:
            <br />
            Actual = 1 if the team wins
            <br />
            Actual = 0 if the team loses
            <br />
            Expected = predicted win chance
          </li>
          <li>
            <strong>Example if Team A wins:</strong>
            <br />
            ExpectedA = 0.57
            <br />
            DeltaA = 24 x (1 - 0.57)
            <br />
            DeltaA ≈ +10
            <br />
            Both players get the same change:
            <br />
            Alex +10
            <br />
            Mike +10
            <br />
            Tom -10
            <br />
            John -10
          </li>
          <li>
            <strong>Why this works</strong>
            <br />
            Beat stronger team -&gt; bigger rating gain
            <br />
            Beat weaker team -&gt; smaller rating gain
            <br />
            Lose to weaker team -&gt; bigger rating loss
            <br />
            Over time the ratings become accurate.
          </li>
        </ul>
      </section>

      <section className="brut-panel space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          Team Elo
        </h2>
        <ul className="space-y-2 text-sm leading-6 text-slate-300">
          <li>
            <strong>Every team starts at 1000</strong>
            <br />
            Each teammate combination has its own rating.
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            Mike + Alex 1000
            <br />
            Tom + John 1000
            <br />
            Alex + Chris 1000
          </li>
          <li>
            <strong>Games are processed oldest -&gt; newest</strong>
            <br />
            Ratings update in the order games happened.
          </li>
          <li>
            <strong>Expected win chance</strong>
            <br />
            Same formula as player Elo:
            <br />
            ExpectedA = 1 / (1 + 10^((TeamB - TeamA)/400))
            <br />
            This calculates which team was expected to win.
          </li>
          <li>
            <strong>K-factor = 24</strong>
            <br />
            Controls how much ratings change after each match.
          </li>
          <li>
            <strong>Update after each match</strong>
            <br />
            Delta = 24 x (Actual - Expected)
            <br />
            Winner gains points.
            <br />
            Loser loses the same amount.
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            Mike + Alex beat Tom + John
            <br />
            Mike + Alex +12
            <br />
            Tom + John -12
          </li>
          <li>
            <strong>Best Teams leaderboard</strong>
            <br />
            Teams are sorted by their team Elo rating.
          </li>
          <li>
            <strong>Example:</strong>
            <br />
            Mike + Alex 1085
            <br />
            Tom + John 1020
            <br />
            Alex + Chris 990
            <br />
            Higher rating = stronger team.
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
