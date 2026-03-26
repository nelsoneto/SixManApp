'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import { useBenchPlayers } from '@/hooks/useBenchPlayers';
import { DEFAULT_SEASON } from '@/types';

function PlayersContent() {
  const searchParams = useSearchParams();
  const season = searchParams.get('season') ?? DEFAULT_SEASON.value;
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error } = useBenchPlayers(season);

  const filtered = (data?.players ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.teamAbbreviation.toLowerCase().includes(search.toLowerCase())
  );

  const sparkPlugCount = filtered.filter((p) => p.isSparkPlug).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple-400">
          {season}
        </p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Bench Rankings</h1>
        <p className="mt-2 text-slate-400">
          Todos os jogadores rankeados por{' '}
          <span className="font-semibold text-purple-300">Bench Efficiency Score</span>
        </p>
      </div>

      {/* Search + stats */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar jogador ou time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 rounded-lg border border-slate-700 bg-[#13131A] px-4 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-colors"
        />
        {data && (
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{filtered.length} jogadores</span>
            <span className="text-yellow-400 font-medium">{sparkPlugCount} Spark Plugs</span>
          </div>
        )}
      </div>

      {/* Table header */}
      <div className="mb-2 hidden md:grid grid-cols-[40px_56px_1fr_80px_80px_80px_80px_128px] gap-4 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        <span>#</span>
        <span />
        <span>Jogador</span>
        <span className="text-center">PTS</span>
        <span className="text-center">REB</span>
        <span className="text-center">AST</span>
        <span className="text-center">+/-</span>
        <span>BES</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          {['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'].map((key) => (
            <div
              key={key}
              className="h-16 animate-pulse rounded-xl border border-slate-800 bg-[#13131A]"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-6 text-center text-sm text-red-400">
          {(error as Error)?.message ?? 'Erro ao carregar dados.'}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-slate-500">Nenhum jogador encontrado.</p>
          ) : (
            filtered.map((player, i) => (
              <PlayerCard key={player.id} player={player} rank={i + 1} season={season} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function PlayersPage() {
  return (
    <Suspense>
      <PlayersContent />
    </Suspense>
  );
}
