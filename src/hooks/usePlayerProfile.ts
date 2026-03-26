'use client';

import { useQuery } from '@tanstack/react-query';
import type { BenchPlayer } from '@/types';

interface PlayerProfileResponse {
  player: BenchPlayer;
}

async function fetchPlayerProfile(id: number, season: string): Promise<PlayerProfileResponse> {
  const params = new URLSearchParams({ season });
  const res = await fetch(`/api/player/${id}?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Jogador não encontrado');
  }
  return res.json();
}

export function usePlayerProfile(id: number, season: string) {
  return useQuery({
    queryKey: ['player-profile', id, season],
    queryFn: () => fetchPlayerProfile(id, season),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
    retry: 1,
  });
}
