import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

type UpdatePlayerRequestBody = {
  name?: string;
};

function normalizePlayerName(value: string | undefined) {
  return (value ?? "").trim();
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  assertSupabaseEnv();
  const payload = (await request.json()) as UpdatePlayerRequestBody;
  const nextName = normalizePlayerName(payload.name);
  if (!nextName) {
    return NextResponse.json({ error: "Player name is required." }, { status: 400 });
  }

  const { id } = await params;
  const { error } = await supabase.from("players").update({ name: nextName }).eq("id", id);
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

  const { count, error: countError } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .or(`player_a1.eq.${id},player_a2.eq.${id},player_b1.eq.${id},player_b2.eq.${id}`);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Cannot delete player with existing games." },
      { status: 400 }
    );
  }

  const { count: teamsCount, error: teamsCountError } = await supabase
    .from("teams")
    .select("*", { count: "exact", head: true })
    .or(`player_1_id.eq.${id},player_2_id.eq.${id}`);

  if (teamsCountError) {
    return NextResponse.json({ error: teamsCountError.message }, { status: 500 });
  }

  if ((teamsCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "Cannot delete player while they are part of existing teams." },
      { status: 400 }
    );
  }

  const { error: deleteError } = await supabase.from("players").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
