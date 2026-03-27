-- Converts created_at columns from `timestamp` (no timezone) to `timestamptz`.
-- Assumes existing values are UTC timestamps.

alter table players
  alter column created_at type timestamptz
  using created_at at time zone 'UTC';

alter table teams
  alter column created_at type timestamptz
  using created_at at time zone 'UTC';

alter table games
  alter column created_at type timestamptz
  using created_at at time zone 'UTC';

