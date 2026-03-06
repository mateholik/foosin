create extension if not exists pgcrypto;

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamp default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  player_a1 uuid not null references players(id),
  player_a2 uuid not null references players(id),
  player_b1 uuid not null references players(id),
  player_b2 uuid not null references players(id),
  score_a int not null check (score_a >= 0),
  score_b int not null check (score_b >= 0),
  created_at timestamp default now()
);
