import type { NBAPlayerStatRow, NBAStatsApiResponse } from '@/types';

const NBA_STATS_BASE = 'https://stats.nba.com/stats';

// Headers obrigatórios — sem eles a NBA retorna 403
const NBA_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Connection: 'keep-alive',
  Host: 'stats.nba.com',
  Origin: 'https://www.nba.com',
  Referer: 'https://www.nba.com/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'x-nba-stats-origin': 'stats',
  'x-nba-stats-token': 'true',
};

/**
 * Converte o formato "rowSet + headers" da NBA Stats API
 * em um array de objetos tipados.
 */
function parseRowSet(
  headers: string[],
  rowSet: Array<Array<string | number | null>>
): NBAPlayerStatRow[] {
  return rowSet.map((row) => {
    const obj: Record<string, string | number | null> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj as unknown as NBAPlayerStatRow;
  });
}

/**
 * Parâmetros base compartilhados entre as duas chamadas.
 */
function buildBaseParams(
  season: string,
  seasonType: string,
  starterBench: 'Bench' | 'Starters'
): URLSearchParams {
  return new URLSearchParams({
    College: '',
    Conference: '',
    Country: '',
    DateFrom: '',
    DateTo: '',
    Division: '',
    DraftPick: '',
    DraftYear: '',
    GameScope: '',
    GameSegment: '',
    Height: '',
    LastNGames: '0',
    LeagueID: '00',
    Location: '',
    MeasureType: 'Base',
    Month: '0',
    OpponentTeamID: '0',
    Outcome: '',
    PORound: '0',
    PaceAdjust: 'N',
    PerMode: 'PerGame',
    Period: '0',
    PlayerExperience: '',
    PlayerPosition: '',
    PlusMinus: 'N',
    Rank: 'N',
    Season: season,
    SeasonSegment: '',
    SeasonType: seasonType,
    ShotClockRange: '',
    StarterBench: starterBench,
    TeamID: '',
    TwoWay: '0',
    VsConference: '',
    VsDivision: '',
    Weight: '',
  });
}

async function fetchStatsByRole(
  season: string,
  seasonType: string,
  role: 'Bench' | 'Starters'
): Promise<NBAPlayerStatRow[]> {
  const params = buildBaseParams(season, seasonType, role);
  const url = `${NBA_STATS_BASE}/leaguedashplayerstats?${params.toString()}`;

  const response = await fetch(url, {
    headers: NBA_HEADERS,
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`NBA Stats API error (${role}): ${response.status} ${response.statusText}`);
  }

  const data: NBAStatsApiResponse = await response.json();
  const resultSet = data.resultSets[0];

  if (!resultSet) {
    throw new Error(`NBA Stats API: resultSet vazio (${role})`);
  }

  return parseRowSet(resultSet.headers, resultSet.rowSet);
}

/**
 * Busca stats de jogadores do banco para uma temporada.
 * StarterBench=Bench filtra apenas os jogos em que o jogador saiu do banco.
 */
export async function fetchBenchPlayerStats(
  season: string,
  seasonType: 'Regular Season' | 'Playoffs' = 'Regular Season'
): Promise<NBAPlayerStatRow[]> {
  return fetchStatsByRole(season, seasonType, 'Bench');
}

/**
 * Busca stats de jogadores como titulares para uma temporada.
 * Usado para calcular o bench_ratio e excluir superstars titulares.
 */
export async function fetchStarterPlayerStats(
  season: string,
  seasonType: 'Regular Season' | 'Playoffs' = 'Regular Season'
): Promise<NBAPlayerStatRow[]> {
  return fetchStatsByRole(season, seasonType, 'Starters');
}

/**
 * URL da foto oficial de um jogador pela NBA CDN.
 */
export function getNBAPlayerPhotoUrl(playerId: number): string {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
}
