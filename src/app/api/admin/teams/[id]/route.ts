import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type UpdateTeamRequestBody = {
  name?: string;
};

function normalizeTeamName(value: string | undefined) {
  return (value ?? "").trim();
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  const payload = (await request.json()) as UpdateTeamRequestBody;
  const nextName = normalizeTeamName(payload.name);
  if (!nextName) {
    return NextResponse.json({ error: "Team name is required." }, { status: 400 });
  }

  const { id } = await params;

  const { error: teamError } = await supabase.from("teams").update({ name: nextName }).eq("id", id);
  if (teamError) {
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  const [teamAUpdate, teamBUpdate] = await Promise.all([
    supabase.from("games").update({ team_a_name: nextName }).eq("team_a_id", id),
    supabase.from("games").update({ team_b_name: nextName }).eq("team_b_id", id),
  ]);

  if (teamAUpdate.error) {
    return NextResponse.json({ error: teamAUpdate.error.message }, { status: 500 });
  }
  if (teamBUpdate.error) {
    return NextResponse.json({ error: teamBUpdate.error.message }, { status: 500 });
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

  const { count, error: countError } = await supabase
    .from("games")
    .select("*", { count: "exact", head: true })
    .or(`team_a_id.eq.${id},team_b_id.eq.${id}`);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Cannot delete team with existing games." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
