import { type NextRequest, NextResponse } from 'next/server';
import { rankBenchPlayers } from '@/lib/benchScore';
import { fetchBenchPlayerStats, fetchStarterPlayerStats } from '@/lib/nbaStatsApi';
import { DEFAULT_SEASON } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') ?? DEFAULT_SEASON.value;
  const seasonType =
    (searchParams.get('seasonType') as 'Regular Season' | 'Playoffs') ?? 'Regular Season';

  try {
    const [benchRows, starterRows] = await Promise.all([
      fetchBenchPlayerStats(season, seasonType),
      fetchStarterPlayerStats(season, seasonType),
    ]);
    const players = rankBenchPlayers(benchRows, starterRows);

    return NextResponse.json({ players, season, total: players.length });
  } catch (error) {
    console.error('[bench-players] Erro ao buscar da NBA Stats API:', error);
    return NextResponse.json(
      { error: 'Não foi possível buscar os dados da NBA. Tente novamente.' },
      { status: 502 }
    );
  }
}
