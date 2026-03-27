import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type UpdateGameRequestBody = {
  scoreA?: number;
  scoreB?: number;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const payload = (await request.json()) as UpdateGameRequestBody;
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

  if (invalidScore) {
    return NextResponse.json({ error: "Invalid score update." }, { status: 400 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("games")
    .update({ score_a: scoreA, score_b: scoreB })
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

  const supabase = getSupabaseServerClient();
  const { id } = await params;
  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
