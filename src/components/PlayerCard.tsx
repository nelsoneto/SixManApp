'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BenchPlayer } from '@/types';
import { BenchEfficiencyBar } from './BenchEfficiencyBar';
import { SparkPlugBadge } from './SparkPlugBadge';

interface PlayerCardProps {
  player: BenchPlayer;
  rank: number;
  season: string;
}

export function PlayerCard({ player, rank, season }: PlayerCardProps) {
  return (
    <Link
      href={`/players/${player.id}?season=${season}`}
      className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-[#13131A] p-4
        hover:border-purple-800/60 hover:bg-[#16161F] hover:shadow-[0_0_20px_rgba(192,132,252,0.1)]
        transition-all duration-200"
    >
      {/* Rank */}
      <span className="w-8 shrink-0 text-center text-sm font-bold text-slate-600">#{rank}</span>

      {/* Photo */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800 group-hover:border-purple-600 transition-colors duration-200">
        <Image
          src={player.photoUrl}
          alt={player.name}
          fill
          className="object-cover object-top"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/48x48/13131A/6B7280?text=${player.firstName[0]}`;
          }}
        />
      </div>

      {/* Name + team + badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white truncate">{player.name}</span>
          {player.isSparkPlug && <SparkPlugBadge size="sm" />}
        </div>
        <p className="text-xs text-slate-500">
          {player.teamAbbreviation} · {player.gamesPlayed}G · {player.minutesPerGame.toFixed(1)} MIN
        </p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-center shrink-0">
        <StatCell label="PTS" value={player.points} />
        <StatCell label="REB" value={player.rebounds} />
        <StatCell label="AST" value={player.assists} />
        <StatCell label="+/-" value={player.plusMinus} signed />
      </div>

      {/* BES */}
      <div className="shrink-0 w-28 hidden md:block">
        <BenchEfficiencyBar score={player.benchEfficiencyScore} showLabel={true} />
      </div>

      {/* BES mobile */}
      <div className="shrink-0 flex flex-col items-end md:hidden">
        <span className="text-sm font-bold text-white">
          {player.benchEfficiencyScore.toFixed(2)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">BES</span>
      </div>
    </Link>
  );
}

function StatCell({
  label,
  value,
  signed = false,
}: {
  label: string;
  value: number;
  signed?: boolean;
}) {
  const display = signed ? `${value > 0 ? '+' : ''}${value.toFixed(1)}` : value.toFixed(1);

  const color = signed
    ? value > 0
      ? 'text-green-400'
      : value < 0
        ? 'text-red-400'
        : 'text-slate-400'
    : 'text-white';

  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-bold ${color}`}>{display}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}
