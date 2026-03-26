'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PodiumCard } from '@/components/PodiumCard';
import { useBenchPlayers } from '@/hooks/useBenchPlayers';
import { DEFAULT_SEASON } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const season = searchParams.get('season') ?? DEFAULT_SEASON.value;

  const { data, isLoading, isError, error } = useBenchPlayers(season);

  const top3 = data?.players.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
          NBA · {season}
        </p>
        <h1 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          The{' '}
          <span className="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
            Bench
          </span>{' '}
          Report
        </h1>
        <p className="mx-auto max-w-xl text-base text-slate-400 sm:text-lg">
          Os holofotes estão sempre nos superstars. Aqui, a gente ilumina quem realmente incendeia o
          jogo saindo do banco.
        </p>
      </section>

      {/* Podium */}
      <section className="w-full max-w-4xl mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Pódio dos Reservas
            <span className="ml-2 text-sm font-normal text-slate-500">— Top BES da temporada</span>
          </h2>
          <Link
            href={`/players?season=${season}`}
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['p1', 'p2', 'p3'] as const).map((key) => (
              <div
                key={key}
                className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-[#13131A]"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-6 text-center text-sm text-red-400">
            <strong>NBA API temporariamente indisponível.</strong>
            <br />
            Tente novamente em alguns minutos.
            <br />
            <span className="block pt-2 text-xs text-red-500/80">
              {(error as Error)?.message ?? 'Erro ao carregar dados.'}
            </span>
          </div>
        )}

        {!isLoading && !isError && top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-start">
            {top3.map((player, i) => (
              <PodiumCard
                key={player.id}
                player={player}
                rank={(i + 1) as 1 | 2 | 3}
                season={season}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats summary */}
      {data && (
        <section className="w-full max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatSummaryCard label="Bench Players" value={data.total} suffix="elegíveis" />
            <StatSummaryCard
              label="Spark Plugs"
              value={data.players.filter((p) => p.isSparkPlug).length}
              suffix="jogadores"
              highlight
            />
            <StatSummaryCard
              label="Maior BES"
              value={data.players[0]?.benchEfficiencyScore.toFixed(2) ?? '—'}
              suffix={data.players[0]?.name.split(' ')[1] ?? ''}
            />
            <StatSummaryCard label="Temporada" value={season} suffix="NBA" />
          </div>
        </section>
      )}
    </div>
  );
}

function StatSummaryCard({
  label,
  value,
  suffix,
  highlight = false,
}: {
  label: string;
  value: string | number;
  suffix: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? 'border-yellow-400/30 bg-yellow-400/5 shadow-[0_0_15px_rgba(250,204,21,0.1)]'
          : 'border-slate-800 bg-[#13131A]'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-black ${highlight ? 'text-yellow-400' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-xs text-slate-600 truncate">{suffix}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
