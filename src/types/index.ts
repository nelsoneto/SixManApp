// ─── Raw NBA Stats API ────────────────────────────────────────────────────────

export interface NBAPlayerStatRow {
  PLAYER_ID: number;
  PLAYER_NAME: string;
  TEAM_ID: number;
  TEAM_ABBREVIATION: string;
  AGE: number;
  GP: number;
  W: number;
  L: number;
  W_PCT: number;
  MIN: number;
  FGM: number;
  FGA: number;
  FG_PCT: number;
  FG3M: number;
  FG3A: number;
  FG3_PCT: number;
  FTM: number;
  FTA: number;
  FT_PCT: number;
  OREB: number;
  DREB: number;
  REB: number;
  AST: number;
  TOV: number;
  STL: number;
  BLK: number;
  BLKA: number;
  PF: number;
  PFD: number;
  PTS: number;
  PLUS_MINUS: number;
  NBA_FANTASY_PTS: number;
  DD2: number;
  TD3: number;
}

export interface NBAStatsApiResponse {
  resultSets: Array<{
    name: string;
    headers: string[];
    rowSet: Array<Array<string | number | null>>;
  }>;
}

// ─── Processed Bench Player ──────────────────────────────────────────────────

export interface BenchPlayer {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  teamId: number;
  teamAbbreviation: string;
  age: number;
  gamesPlayed: number;
  minutesPerGame: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  plusMinus: number;
  fieldGoalPct: number;
  threePointPct: number;
  freeThrowPct: number;
  benchEfficiencyScore: number;
  isSparkPlug: boolean;
  photoUrl: string;
}

// ─── Season ───────────────────────────────────────────────────────────────────

export interface SeasonOption {
  label: string; // "2025-26"
  value: string; // "2025-26" (formato da NBA Stats API)
  year: number; // 2025
}

export const SEASONS: SeasonOption[] = [
  { label: '2025-26', value: '2025-26', year: 2025 },
  { label: '2024-25', value: '2024-25', year: 2024 },
  { label: '2023-24', value: '2023-24', year: 2023 },
  { label: '2022-23', value: '2022-23', year: 2022 },
  { label: '2021-22', value: '2021-22', year: 2021 },
  { label: '2020-21', value: '2020-21', year: 2020 },
  { label: '2019-20', value: '2019-20', year: 2019 },
];

export const DEFAULT_SEASON = SEASONS[0];

// ─── Spark Plug Criteria ─────────────────────────────────────────────────────

export const SPARK_PLUG_MIN_BES = 1.0;
export const SPARK_PLUG_MIN_GP = 10;
export const SPARK_PLUG_MIN_MIN = 12;
