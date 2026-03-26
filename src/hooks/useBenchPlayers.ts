'use client';

import { useQuery } from '@tanstack/react-query';
import type { BenchPlayer } from '@/types';

interface BenchPlayersResponse {
  players: BenchPlayer[];
  season: string;
  total: number;
}

async function fetchBenchPlayers(
  season: string,
  seasonType: string
): Promise<BenchPlayersResponse> {
  const params = new URLSearchParams({ season, seasonType });
  const res = await fetch(`/api/bench-players?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao buscar bench players');
  }
  return res.json();
}

export function useBenchPlayers(season: string, seasonType: string = 'Regular Season') {
  return useQuery({
    queryKey: ['bench-players', season, seasonType],
    queryFn: () => fetchBenchPlayers(season, seasonType),
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 2,
  });
}
