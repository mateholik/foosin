import { NextResponse } from "next/server";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

type GameRequestBody = {
  teamAId?: string;
  teamAName?: string;
  playerA1?: string;
  playerA2?: string;
  teamBId?: string;
  teamBName?: string;
  playerB1?: string;
  playerB2?: string;
  scoreA?: number;
  scoreB?: number;
};

function normalizeName(value?: string) {
  return value?.trim() ?? "";
}

export async function POST(request: Request) {
  assertSupabaseEnv();
  const payload = (await request.json()) as GameRequestBody;
  const teamAName = normalizeName(payload.teamAName);
  const teamBName = normalizeName(payload.teamBName);
  const playerIds = [payload.playerA1, payload.playerA2, payload.playerB1, payload.playerB2];
  const scores = [payload.scoreA, payload.scoreB];
  const teamIds = [payload.teamAId, payload.teamBId];

  const hasMissingPlayer = playerIds.some((playerId) => !playerId);
  const hasMissingTeam = teamIds.some((teamId) => !teamId) || !teamAName || !teamBName;
  const hasInvalidScore =
    scores.some((score) => typeof score !== "number" || Number.isNaN(score) || score < 0) ||
    payload.scoreA === payload.scoreB;

  if (hasMissingPlayer || hasMissingTeam || hasInvalidScore) {
    return NextResponse.json({ error: "Invalid game payload." }, { status: 400 });
  }

  const uniquePlayers = new Set(playerIds);
  if (uniquePlayers.size !== 4) {
    return NextResponse.json({ error: "Players must be unique." }, { status: 400 });
  }

  if (teamAName.toLowerCase() === teamBName.toLowerCase()) {
    return NextResponse.json({ error: "Team names must be different." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("games")
    .insert({
      team_a_id: payload.teamAId,
      team_a_name: teamAName,
      player_a1: payload.playerA1,
      player_a2: payload.playerA2,
      team_b_id: payload.teamBId,
      team_b_name: teamBName,
      player_b1: payload.playerB1,
      player_b2: payload.playerB2,
      score_a: payload.scoreA,
      score_b: payload.scoreB,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
