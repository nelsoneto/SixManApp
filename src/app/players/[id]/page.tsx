'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { BenchEfficiencyBar } from '@/components/BenchEfficiencyBar';
import { SparkPlugBadge } from '@/components/SparkPlugBadge';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';
import { DEFAULT_SEASON } from '@/types';

function StatBlock({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-[#13131A] p-4">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </span>
      <span className="text-2xl font-black text-white">{value}</span>
      {sub && <span className="text-xs text-slate-600 mt-0.5">{sub}</span>}
    </div>
  );
}

function PlayerProfileContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const playerId = parseInt(params.id as string, 10);
  const season = searchParams.get('season') ?? DEFAULT_SEASON.value;

  const { data, isLoading, isError, error } = usePlayerProfile(playerId, season);
  const player = data?.player;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-slate-800" />
        <div className="flex gap-6">
          <div className="h-32 w-32 rounded-full bg-slate-800" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 rounded-lg bg-slate-800" />
            <div className="h-4 w-32 rounded-lg bg-slate-800" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !player) {
    return (
      <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-8 text-center">
        <p className="text-red-400 text-sm">
          {(error as Error)?.message ?? 'Jogador não encontrado.'}
        </p>
        <Link
          href={`/players?season=${season}`}
          className="mt-4 inline-block text-sm text-purple-400 hover:text-purple-300"
        >
          ← Voltar para Rankings
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href={`/players?season=${season}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        ← Rankings
      </Link>

      {/* Player header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-purple-700 bg-slate-800 shadow-[0_0_30px_rgba(192,132,252,0.2)]">
          <Image
            src={player.photoUrl}
            alt={player.name}
            fill
            className="object-cover object-top"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.src = `https://via.placeholder.com/112x112/13131A/6B7280?text=${player.firstName[0]}`;
            }}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white sm:text-4xl">{player.name}</h1>
            {player.isSparkPlug && <SparkPlugBadge size="lg" />}
          </div>
          <p className="text-slate-400">
            {player.teamAbbreviation} · {season} · {player.gamesPlayed} jogos
          </p>

          {/* BES destacado */}
          <div className="mt-4 max-w-xs">
            <BenchEfficiencyBar score={player.benchEfficiencyScore} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Médias por jogo (vindo do banco)
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <StatBlock label="Pontos" value={player.points.toFixed(1)} />
        <StatBlock label="Rebotes" value={player.rebounds.toFixed(1)} />
        <StatBlock label="Assistências" value={player.assists.toFixed(1)} />
        <StatBlock label="Roubos" value={player.steals.toFixed(1)} />
        <StatBlock label="Bloqueios" value={player.blocks.toFixed(1)} />
        <StatBlock label="Turnovers" value={player.turnovers.toFixed(1)} />
      </div>

      {/* Shooting */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Eficiência de arremesso
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBlock label="FG%" value={`${(player.fieldGoalPct * 100).toFixed(1)}%`} sub="Campo" />
        <StatBlock
          label="3P%"
          value={`${(player.threePointPct * 100).toFixed(1)}%`}
          sub="Três pontos"
        />
        <StatBlock
          label="FT%"
          value={`${(player.freeThrowPct * 100).toFixed(1)}%`}
          sub="Lance livre"
        />
      </div>

      {/* Impact */}
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
        Impacto
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBlock
          label="+/-"
          value={`${player.plusMinus > 0 ? '+' : ''}${player.plusMinus.toFixed(1)}`}
          sub="Plus/Minus"
        />
        <StatBlock label="Minutos" value={player.minutesPerGame.toFixed(1)} sub="por jogo" />
        <StatBlock label="Idade" value={player.age} sub="anos" />
        <StatBlock
          label="BES"
          value={player.benchEfficiencyScore.toFixed(2)}
          sub="Bench Efficiency"
        />
      </div>
    </div>
  );
}

export default function PlayerProfilePage() {
  return (
    <Suspense>
      <PlayerProfileContent />
    </Suspense>
  );
}
