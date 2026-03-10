begin;

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  player_1_id uuid not null references players(id),
  player_2_id uuid not null references players(id),
  created_at timestamp default now(),
  constraint teams_distinct_players check (player_1_id <> player_2_id)
);

alter table if exists teams
  drop constraint if exists teams_unique_player_pair;

alter table teams
  add constraint teams_unique_player_pair unique (player_1_id, player_2_id);

alter table games add column if not exists team_a_id uuid references teams(id);
alter table games add column if not exists team_a_name text;
alter table games add column if not exists team_b_id uuid references teams(id);
alter table games add column if not exists team_b_name text;

with ordered_games as (
  select
    id,
    case
      when player_a1 < player_a2 then player_a1
      else player_a2
    end as team_a_player_1,
    case
      when player_a1 < player_a2 then player_a2
      else player_a1
    end as team_a_player_2,
    case
      when player_b1 < player_b2 then player_b1
      else player_b2
    end as team_b_player_1,
    case
      when player_b1 < player_b2 then player_b2
      else player_b1
    end as team_b_player_2
  from games
),
team_pairs as (
  select distinct team_a_player_1 as player_1_id, team_a_player_2 as player_2_id from ordered_games
  union
  select distinct team_b_player_1 as player_1_id, team_b_player_2 as player_2_id from ordered_games
),
team_names as (
  select
    pair.player_1_id,
    pair.player_2_id,
    concat(p1.name, ' + ', p2.name) as name
  from team_pairs pair
  join players p1 on p1.id = pair.player_1_id
  join players p2 on p2.id = pair.player_2_id
)
insert into teams (name, player_1_id, player_2_id)
select name, player_1_id, player_2_id
from team_names
on conflict (player_1_id, player_2_id) do nothing;

update games
set
  team_a_id = team_a_team.id,
  team_a_name = coalesce(games.team_a_name, team_a_team.name),
  team_b_id = team_b_team.id,
  team_b_name = coalesce(games.team_b_name, team_b_team.name)
from (
  select
    og.id,
    ta.id as team_a_id,
    ta.name,
    tb.id as team_b_id,
    tb.name as team_b_name
  from ordered_games og
  join teams ta
    on ta.player_1_id = og.team_a_player_1
   and ta.player_2_id = og.team_a_player_2
  join teams tb
    on tb.player_1_id = og.team_b_player_1
   and tb.player_2_id = og.team_b_player_2
) as resolved
join teams team_a_team on team_a_team.id = resolved.team_a_id
join teams team_b_team on team_b_team.id = resolved.team_b_id
where games.id = resolved.id;

alter table games alter column team_a_id set not null;
alter table games alter column team_a_name set not null;
alter table games alter column team_b_id set not null;
alter table games alter column team_b_name set not null;

commit;
