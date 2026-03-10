create extension if not exists pgcrypto;

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamp default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  player_1_id uuid not null references players(id),
  player_2_id uuid not null references players(id),
  created_at timestamp default now(),
  constraint teams_distinct_players check (player_1_id <> player_2_id),
  constraint teams_unique_player_pair unique (player_1_id, player_2_id)
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  team_a_id uuid not null references teams(id),
  team_a_name text not null,
  player_a1 uuid not null references players(id),
  player_a2 uuid not null references players(id),
  team_b_id uuid not null references teams(id),
  team_b_name text not null,
  player_b1 uuid not null references players(id),
  player_b2 uuid not null references players(id),
  score_a int not null check (score_a >= 0),
  score_b int not null check (score_b >= 0),
  created_at timestamp default now()
);
