import { NextResponse } from "next/server";
import { assertSupabaseEnv, supabase, type Team } from "@/lib/supabase";

type InputTeam = {
  name?: string;
  playerNames?: string[];
};

type PrepareTeamsRequestBody = {
  teams?: InputTeam[];
};

type ResolvedTeam = {
  id?: string;
  name: string;
  playerIds: [string, string];
};

function normalizeName(value?: string) {
  return value?.trim() ?? "";
}

function normalizePlayerNames(input: string[] = []) {
  return input.map(normalizeName).filter(Boolean);
}

function pairKey(firstId: string, secondId: string) {
  return [firstId, secondId].sort().join(":");
}

export async function POST(request: Request) {
  assertSupabaseEnv();
  const payload = (await request.json()) as PrepareTeamsRequestBody;
  const teamsInput = payload.teams ?? [];

  if (teamsInput.length !== 2) {
    return NextResponse.json({ error: "Exactly two teams are required." }, { status: 400 });
  }

  const { data: existingTeamsData, error: existingTeamsError } = await supabase
    .from("teams")
    .select("id,name,player_1_id,player_2_id");

  if (existingTeamsError) {
    return NextResponse.json({ error: existingTeamsError.message }, { status: 500 });
  }

  const existingTeams = (existingTeamsData ?? []) as Team[];
  const teamsByName = new Map(existingTeams.map((team) => [team.name.toLowerCase(), team]));
  const teamsByPair = new Map(
    existingTeams.map((team) => [pairKey(team.player_1_id, team.player_2_id), team])
  );

  const pendingNewTeams: Array<{ index: number; name: string; playerNames: [string, string] }> = [];
  const resolvedTeams: ResolvedTeam[] = [];
  const playerNamesToFetch = new Set<string>();

  for (const [index, inputTeam] of teamsInput.entries()) {
    const name = normalizeName(inputTeam.name);
    if (!name) {
      return NextResponse.json({ error: "Team names are required." }, { status: 400 });
    }

    const existingTeam = teamsByName.get(name.toLowerCase());
    if (existingTeam) {
      resolvedTeams[index] = {
        id: existingTeam.id,
        name: existingTeam.name,
        playerIds: [existingTeam.player_1_id, existingTeam.player_2_id],
      };
      continue;
    }

    const normalizedPlayerNames = normalizePlayerNames(inputTeam.playerNames);
    if (normalizedPlayerNames.length !== 2) {
      return NextResponse.json(
        { error: `Select two players for new team "${name}".` },
        { status: 400 }
      );
    }

    const uniqueNames = new Set(normalizedPlayerNames.map((playerName) => playerName.toLowerCase()));
    if (uniqueNames.size !== 2) {
      return NextResponse.json(
        { error: `Team "${name}" must have two distinct players.` },
        { status: 400 }
      );
    }

    playerNamesToFetch.add(normalizedPlayerNames[0]);
    playerNamesToFetch.add(normalizedPlayerNames[1]);
    pendingNewTeams.push({
      index,
      name,
      playerNames: [normalizedPlayerNames[0], normalizedPlayerNames[1]],
    });
  }

  const playerNames = Array.from(playerNamesToFetch);
  if (playerNames.length > 0) {
    const { error: upsertError } = await supabase
      .from("players")
      .upsert(playerNames.map((name) => ({ name })), { onConflict: "name" });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  const playersByName = new Map<string, { id: string; name: string }>();
  if (playerNames.length > 0) {
    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("id,name")
      .in("name", playerNames);

    if (playersError) {
      return NextResponse.json({ error: playersError.message }, { status: 500 });
    }

    for (const player of playersData ?? []) {
      playersByName.set(player.name.toLowerCase(), player);
    }
  }

  const reservedPairs = new Map<string, string>();
  const reservedNames = new Map<string, string>();

  for (const pendingTeam of pendingNewTeams) {
    const firstPlayer = playersByName.get(pendingTeam.playerNames[0].toLowerCase());
    const secondPlayer = playersByName.get(pendingTeam.playerNames[1].toLowerCase());

    if (!firstPlayer || !secondPlayer) {
      return NextResponse.json(
        { error: `Could not resolve players for team "${pendingTeam.name}".` },
        { status: 500 }
      );
    }

    const normalizedPairKey = pairKey(firstPlayer.id, secondPlayer.id);
    const existingTeamForPair = teamsByPair.get(normalizedPairKey);
    if (existingTeamForPair) {
      return NextResponse.json(
        {
          error: `Players for "${pendingTeam.name}" already exist as team "${existingTeamForPair.name}".`,
        },
        { status: 400 }
      );
    }

    const existingReservedName = reservedNames.get(pendingTeam.name.toLowerCase());
    if (existingReservedName) {
      return NextResponse.json(
        { error: `Team name "${pendingTeam.name}" is duplicated in this request.` },
        { status: 400 }
      );
    }

    const existingReservedPair = reservedPairs.get(normalizedPairKey);
    if (existingReservedPair) {
      return NextResponse.json(
        { error: `Two teams use the same player pair in this request.` },
        { status: 400 }
      );
    }

    reservedNames.set(pendingTeam.name.toLowerCase(), pendingTeam.name);
    reservedPairs.set(normalizedPairKey, pendingTeam.name);
    resolvedTeams[pendingTeam.index] = {
      name: pendingTeam.name,
      playerIds: [firstPlayer.id, secondPlayer.id].sort() as [string, string],
    };
  }

  if (resolvedTeams.length !== 2 || resolvedTeams.some((team) => !team)) {
    return NextResponse.json({ error: "Could not resolve teams." }, { status: 500 });
  }

  if (resolvedTeams[0].name.toLowerCase() === resolvedTeams[1].name.toLowerCase()) {
    return NextResponse.json({ error: "Team names must be different." }, { status: 400 });
  }

  const allPlayerIds = new Set([...resolvedTeams[0].playerIds, ...resolvedTeams[1].playerIds]);
  if (allPlayerIds.size !== 4) {
    return NextResponse.json(
      { error: "Teams cannot share players in the same game." },
      { status: 400 }
    );
  }

  for (const team of resolvedTeams) {
    if (team.id) continue;

    const { data: insertedTeam, error: insertTeamError } = await supabase
      .from("teams")
      .insert({
        name: team.name,
        player_1_id: team.playerIds[0],
        player_2_id: team.playerIds[1],
      })
      .select("id,name,player_1_id,player_2_id")
      .single();

    if (insertTeamError) {
      return NextResponse.json({ error: insertTeamError.message }, { status: 500 });
    }

    team.id = insertedTeam.id;
    team.name = insertedTeam.name;
    team.playerIds = [insertedTeam.player_1_id, insertedTeam.player_2_id];
  }

  return NextResponse.json({
    teams: resolvedTeams.map((team) => ({
      id: team.id,
      name: team.name,
      playerIds: team.playerIds,
    })),
  });
}
