import { NextResponse } from "next/server";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

type GameRequestBody = {
  playerA1?: string;
  playerA2?: string;
  playerB1?: string;
  playerB2?: string;
  scoreA?: number;
  scoreB?: number;
};

export async function POST(request: Request) {
  assertSupabaseEnv();
  const payload = (await request.json()) as GameRequestBody;
  const playerIds = [payload.playerA1, payload.playerA2, payload.playerB1, payload.playerB2];
  const scores = [payload.scoreA, payload.scoreB];

  const hasMissingPlayer = playerIds.some((playerId) => !playerId);
  const hasInvalidScore =
    scores.some((score) => typeof score !== "number" || Number.isNaN(score) || score < 0) ||
    payload.scoreA === payload.scoreB;

  if (hasMissingPlayer || hasInvalidScore) {
    return NextResponse.json({ error: "Invalid game payload." }, { status: 400 });
  }

  const uniquePlayers = new Set(playerIds);
  if (uniquePlayers.size !== 4) {
    return NextResponse.json({ error: "Players must be unique." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("games")
    .insert({
      player_a1: payload.playerA1,
      player_a2: payload.playerA2,
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
