'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { BenchPlayer } from '@/types';
import { BenchEfficiencyBar } from './BenchEfficiencyBar';
import { SparkPlugBadge } from './SparkPlugBadge';

interface PodiumCardProps {
  player: BenchPlayer;
  rank: 1 | 2 | 3;
  season: string;
}

const RANK_CONFIG = {
  1: {
    glow: 'shadow-[0_0_40px_rgba(250,204,21,0.2)]',
    border: 'border-yellow-400/50',
    accent: 'text-yellow-400',
    crown: '👑',
    photoRing: 'border-yellow-400/60',
    photoBg: 'bg-yellow-400/10',
    photoSize: 'h-28 w-28',
    nameSize: 'text-lg',
    topPadding: 'pt-8',
  },
  2: {
    glow: 'shadow-[0_0_25px_rgba(192,132,252,0.15)]',
    border: 'border-purple-400/40',
    accent: 'text-purple-300',
    crown: '🥈',
    photoRing: 'border-purple-400/50',
    photoBg: 'bg-purple-400/10',
    photoSize: 'h-24 w-24',
    nameSize: 'text-base',
    topPadding: 'pt-5',
  },
  3: {
    glow: 'shadow-[0_0_15px_rgba(192,132,252,0.1)]',
    border: 'border-slate-700/60',
    accent: 'text-slate-400',
    crown: '🥉',
    photoRing: 'border-slate-600/50',
    photoBg: 'bg-slate-700/20',
    photoSize: 'h-20 w-20',
    nameSize: 'text-sm',
    topPadding: 'pt-4',
  },
};

const ORDER = { 1: 'md:order-2', 2: 'md:order-1', 3: 'md:order-3' };

export function PodiumCard({ player, rank, season }: PodiumCardProps) {
  const cfg = RANK_CONFIG[rank];

  return (
    <Link
      href={`/players/${player.id}?season=${season}`}
      className={`
        group relative flex flex-col items-center rounded-2xl border bg-[#13131A] p-5
        transition-all duration-300 hover:-translate-y-1
        ${cfg.topPadding} ${ORDER[rank]} ${cfg.glow} ${cfg.border}
      `}
    >
      {/* Rank crown */}
      <div className={`mb-3 text-2xl ${rank === 1 ? 'animate-bounce' : ''}`}>{cfg.crown}</div>

      {/* Photo */}
      <div
        className={`relative mb-3 overflow-hidden rounded-full border-2 transition-colors duration-300
          group-hover:border-purple-400 ${cfg.photoSize} ${cfg.photoRing} ${cfg.photoBg}`}
      >
        <Image
          src={player.photoUrl}
          alt={player.name}
          fill
          className="object-cover object-top"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/100x100/13131A/6B7280?text=${player.firstName[0]}`;
          }}
        />
      </div>

      {/* Name + team */}
      <h3 className={`mb-0.5 text-center font-bold text-white leading-tight ${cfg.nameSize}`}>
        {player.name}
      </h3>
      <p className="mb-3 text-xs text-slate-500 font-medium">{player.teamAbbreviation}</p>

      {/* Spark Plug badge */}
      {player.isSparkPlug && (
        <div className="mb-3">
          <SparkPlugBadge size="sm" />
        </div>
      )}

      {/* BES */}
      <div className="w-full mt-auto">
        <BenchEfficiencyBar score={player.benchEfficiencyScore} />
      </div>

      {/* Key stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 w-full text-center">
        <StatMini label="PTS" value={player.points} />
        <StatMini label="REB" value={player.rebounds} />
        <StatMini label="AST" value={player.assists} />
      </div>
    </Link>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-base font-bold text-white">{value.toFixed(1)}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}
