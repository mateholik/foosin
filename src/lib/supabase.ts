export type Player = {
  id: string;
  name: string;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  player_1_id: string;
  player_2_id: string;
  created_at: string;
};

export type Game = {
  id: string;
  team_a_id: string;
  team_a_name: string;
  player_a1: string;
  player_a2: string;
  team_b_id: string;
  team_b_name: string;
  player_b1: string;
  player_b2: string;
  score_a: number;
  score_b: number;
  created_at: string;
};

