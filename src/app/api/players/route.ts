import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type PlayersRequestBody = {
  names?: string[];
};

function normalizeNames(input: string[] = []) {
  return input
    .map((name) => name.trim())
    .filter(Boolean)
    .reduce<string[]>((result, name) => {
      const isDuplicate = result.some(
        (existingName) => existingName.toLowerCase() === name.toLowerCase()
      );
      if (!isDuplicate) result.push(name);
      return result;
    }, []);
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  const payload = (await request.json()) as PlayersRequestBody;
  const names = normalizeNames(payload.names);

  if (names.length === 0) {
    return NextResponse.json({ error: "No players provided." }, { status: 400 });
  }

  const { error: upsertError } = await supabase
    .from("players")
    .upsert(names.map((name) => ({ name })), { onConflict: "name" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  const { data, error: fetchError } = await supabase
    .from("players")
    .select("id,name")
    .in("name", names);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const byName = new Map((data ?? []).map((player) => [player.name.toLowerCase(), player]));
  const players = names
    .map((name) => byName.get(name.toLowerCase()))
    .filter((player): player is { id: string; name: string } => Boolean(player));

  return NextResponse.json({ players });
}
