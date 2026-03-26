import { type NextRequest, NextResponse } from 'next/server';
import { filterTrueBenchPlayers, toBenchPlayer } from '@/lib/benchScore';
import { fetchBenchPlayerStats, fetchStarterPlayerStats } from '@/lib/nbaStatsApi';
import { DEFAULT_SEASON } from '@/types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const playerId = parseInt(params.id, 10);
  if (Number.isNaN(playerId)) {
    return NextResponse.json({ error: 'ID de jogador inválido' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const season = searchParams.get('season') ?? DEFAULT_SEASON.value;

  try {
    const [benchRows, starterRows] = await Promise.all([
      fetchBenchPlayerStats(season),
      fetchStarterPlayerStats(season),
    ]);

    // Aplica o filtro de elegibilidade antes de procurar o jogador
    const eligibleRows = filterTrueBenchPlayers(benchRows, starterRows);
    const row = eligibleRows.find((r) => r.PLAYER_ID === playerId);

    if (!row) {
      return NextResponse.json(
        { error: 'Jogador não encontrado ou não é um bench player nesta temporada.' },
        { status: 404 }
      );
    }

    const player = toBenchPlayer(row);
    return NextResponse.json({ player });
  } catch (error) {
    console.error('[player/id] Erro ao buscar jogador:', error);
    return NextResponse.json(
      { error: 'Não foi possível buscar os dados do jogador.' },
      { status: 502 }
    );
  }
}
