begin;

insert into players (name) values
  ('Mike'),
  ('Alex'),
  ('John'),
  ('Tom'),
  ('Chris'),
  ('Sam')
on conflict (name) do nothing;

with ids as (
  select id, name from players
),
teams_seed (team_name, player_one, player_two) as (
  values
    ('The Rockets', 'Mike',  'Alex'),
    ('Bar Warriors', 'Tom',   'John'),
    ('Spin Doctors', 'Tom',   'Chris'),
    ('Net Breakers', 'Alex',  'John'),
    ('Chaos Crew',   'Mike',  'Tom'),
    ('Clean Finish', 'Chris', 'Sam'),
    ('Yellow Flash', 'Alex',  'Chris'),
    ('Block Party',  'John',  'Sam'),
    ('Night Shift',  'Mike',  'John'),
    ('Late Winners', 'Sam',   'Tom'),
    ('Counter Force','Chris', 'Mike')
),
ordered_teams as (
  select
    team_name,
    case when p1.id < p2.id then p1.id else p2.id end as player_1_id,
    case when p1.id < p2.id then p2.id else p1.id end as player_2_id
  from teams_seed
  join ids p1 on p1.name = player_one
  join ids p2 on p2.name = player_two
),
inserted_teams as (
  insert into teams (name, player_1_id, player_2_id)
  select team_name, player_1_id, player_2_id
  from ordered_teams
  on conflict (name) do update
  set player_1_id = excluded.player_1_id,
      player_2_id = excluded.player_2_id
  returning id, name
),
resolved_teams as (
  select id, name from inserted_teams
  union
  select id, name from teams
),
games_seed (team_a_name, a1, a2, team_b_name, b1, b2, score_a, score_b, days_ago) as (
  values
    ('The Rockets', 'Mike', 'Alex',  'Bar Warriors', 'Tom',   'John', 10, 7,  7),
    ('Spin Doctors','Tom',  'Chris', 'The Rockets',  'Mike',  'Alex', 10, 9,  6),
    ('Net Breakers','Alex', 'John',  'Chaos Crew',   'Mike',  'Tom',  10, 6,  5),
    ('Chaos Crew',  'Mike', 'Tom',   'Clean Finish', 'Chris', 'Sam',  10, 8,  4),
    ('Yellow Flash','Alex', 'Chris', 'Block Party',  'John',  'Sam',  10, 4,  3),
    ('Night Shift', 'Mike', 'John',  'Chaos Crew',   'Alex',  'Tom',   9, 10, 2),
    ('Late Winners','Sam',  'Tom',   'Counter Force','Chris', 'Mike', 10, 7,  1)
)
insert into games (
  team_a_id,
  team_a_name,
  player_a1,
  player_a2,
  team_b_id,
  team_b_name,
  player_b1,
  player_b2,
  score_a,
  score_b,
  created_at
)
select
  team_a.id,
  g.team_a_name,
  p1.id,
  p2.id,
  team_b.id,
  g.team_b_name,
  p3.id,
  p4.id,
  g.score_a,
  g.score_b,
  now() - make_interval(days => g.days_ago)
from games_seed g
join resolved_teams team_a on team_a.name = g.team_a_name
join resolved_teams team_b on team_b.name = g.team_b_name
join ids p1 on p1.name = g.a1
join ids p2 on p2.name = g.a2
join ids p3 on p3.name = g.b1
join ids p4 on p4.name = g.b2;

commit;
