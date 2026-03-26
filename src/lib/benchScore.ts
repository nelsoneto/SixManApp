import {
  type BenchPlayer,
  type NBAPlayerStatRow,
  SPARK_PLUG_MIN_BES,
  SPARK_PLUG_MIN_GP,
  SPARK_PLUG_MIN_MIN,
} from '@/types';
import { getNBAPlayerPhotoUrl } from './nbaStatsApi';

/**
 * Bench Efficiency Score (BES)
 *
 * Fórmula: (PTS + AST×1.5 + REB×1.2 + STL×2 + BLK×2 - TOV×1.5) / MIN
 *
 * Normalizado por minuto para ser justo com jogadores de banco
 * que têm menos tempo em quadra que titulares.
 */
export function calcBES(row: NBAPlayerStatRow): number {
  if (!row.MIN || row.MIN === 0) return 0;

  const score = row.PTS + row.AST * 1.5 + row.REB * 1.2 + row.STL * 2 + row.BLK * 2 - row.TOV * 1.5;

  return parseFloat((score / row.MIN).toFixed(3));
}

/**
 * Verifica se um jogador atende aos critérios de "Spark Plug":
 * - BES >= 1.5
 * - Mínimo de 10 jogos
 * - Média de pelo menos 15 minutos por jogo
 */
export function isSparkPlug(bes: number, gp: number, min: number): boolean {
  return bes >= SPARK_PLUG_MIN_BES && gp >= SPARK_PLUG_MIN_GP && min >= SPARK_PLUG_MIN_MIN;
}

/**
 * Converte um NBAPlayerStatRow em BenchPlayer processado,
 * com BES calculado e badge Spark Plug determinado.
 */
export function toBenchPlayer(row: NBAPlayerStatRow): BenchPlayer {
  const bes = calcBES(row);
  const nameParts = row.PLAYER_NAME.split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') ?? '';

  return {
    id: row.PLAYER_ID,
    name: row.PLAYER_NAME,
    firstName,
    lastName,
    teamId: row.TEAM_ID,
    teamAbbreviation: row.TEAM_ABBREVIATION,
    age: row.AGE,
    gamesPlayed: row.GP,
    minutesPerGame: row.MIN,
    points: row.PTS,
    rebounds: row.REB,
    assists: row.AST,
    steals: row.STL,
    blocks: row.BLK,
    turnovers: row.TOV,
    plusMinus: row.PLUS_MINUS,
    fieldGoalPct: row.FG_PCT,
    threePointPct: row.FG3_PCT,
    freeThrowPct: row.FT_PCT,
    benchEfficiencyScore: bes,
    isSparkPlug: isSparkPlug(bes, row.GP, row.MIN),
    photoUrl: getNBAPlayerPhotoUrl(row.PLAYER_ID),
  };
}

/**
 * Critério de elegibilidade como "verdadeiro bench player":
 *
 *   bench_ratio = GP_banco / (GP_banco + GP_titular)
 *
 * O jogador precisa ter >= 60% dos jogos saindo do banco.
 * Isso exclui superstars como Wembanyama que são titulares
 * na esmagadora maioria dos jogos.
 *
 * Também exige mínimo de 10 jogos do banco para ter volume relevante.
 */
const MIN_BENCH_RATIO = 0.6;
const MIN_BENCH_GAMES = 10;

export function filterTrueBenchPlayers(
  benchRows: NBAPlayerStatRow[],
  starterRows: NBAPlayerStatRow[]
): NBAPlayerStatRow[] {
  // Mapa rápido: PLAYER_ID → GP como titular
  const starterGpMap = new Map<number, number>();
  for (const row of starterRows) {
    starterGpMap.set(row.PLAYER_ID, row.GP);
  }

  return benchRows.filter((row) => {
    const gpBench = row.GP;
    const gpStarter = starterGpMap.get(row.PLAYER_ID) ?? 0;
    const totalGp = gpBench + gpStarter;

    if (totalGp === 0) return false;

    const benchRatio = gpBench / totalGp;

    return gpBench >= MIN_BENCH_GAMES && benchRatio >= MIN_BENCH_RATIO;
  });
}

/**
 * Processa e rankeia uma lista de rows da NBA Stats API,
 * retornando BenchPlayers ordenados por BES (maior primeiro).
 * Filtra jogadores com menos de 5 jogos para reduzir ruído.
 */
export function rankBenchPlayers(
  benchRows: NBAPlayerStatRow[],
  starterRows: NBAPlayerStatRow[]
): BenchPlayer[] {
  return filterTrueBenchPlayers(benchRows, starterRows)
    .filter((r) => r.MIN > 0)
    .map(toBenchPlayer)
    .sort((a, b) => b.benchEfficiencyScore - a.benchEfficiencyScore);
}
