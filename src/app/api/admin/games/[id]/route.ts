import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

type UpdateGameRequestBody = {
  teamAName?: string;
  teamBName?: string;
  scoreA?: number;
  scoreB?: number;
};

function normalizeName(value?: string) {
  return value?.trim() ?? "";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  assertSupabaseEnv();
  const payload = (await request.json()) as UpdateGameRequestBody;
  const teamAName = normalizeName(payload.teamAName);
  const teamBName = normalizeName(payload.teamBName);
  const scoreA = payload.scoreA;
  const scoreB = payload.scoreB;
  const invalidScore =
    typeof scoreA !== "number" ||
    typeof scoreB !== "number" ||
    Number.isNaN(scoreA) ||
    Number.isNaN(scoreB) ||
    scoreA < 0 ||
    scoreB < 0 ||
    scoreA === scoreB;

  if (invalidScore || !teamAName || !teamBName) {
    return NextResponse.json({ error: "Invalid game update." }, { status: 400 });
  }

  if (teamAName.toLowerCase() === teamBName.toLowerCase()) {
    return NextResponse.json({ error: "Team names must be different." }, { status: 400 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("games")
    .update({ team_a_name: teamAName, team_b_name: teamBName, score_a: scoreA, score_b: scoreB })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  assertSupabaseEnv();
  const { id } = await params;
  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
