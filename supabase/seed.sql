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
games_seed (a1, a2, b1, b2, score_a, score_b, days_ago) as (
  values
    ('Mike', 'Alex',  'Tom',   'John', 10, 7,  7),
    ('Tom',  'Chris', 'Mike',  'Alex', 10, 9,  6),
    ('Alex', 'John',  'Tom',   'Mike', 10, 6,  5),
    ('Mike', 'Tom',   'Chris', 'Sam',  10, 8,  4),
    ('Alex', 'Chris', 'John',  'Sam',  10, 4,  3),
    ('Mike', 'John',  'Alex',  'Tom',  9,  10, 2),
    ('Sam',  'Tom',   'Chris', 'Mike', 10, 7,  1)
)
insert into games (player_a1, player_a2, player_b1, player_b2, score_a, score_b, created_at)
select
  p1.id,
  p2.id,
  p3.id,
  p4.id,
  g.score_a,
  g.score_b,
  now() - make_interval(days => g.days_ago)
from games_seed g
join ids p1 on p1.name = g.a1
join ids p2 on p2.name = g.a2
join ids p3 on p3.name = g.b1
join ids p4 on p4.name = g.b2;

commit;
