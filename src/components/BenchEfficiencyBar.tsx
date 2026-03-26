'use client';

interface BenchEfficiencyBarProps {
  score: number;
  maxScore?: number;
  showLabel?: boolean;
}

// Paleta de cor baseada no score
function getScoreColor(score: number): string {
  if (score >= 2.5) return 'from-yellow-400 to-yellow-300';
  if (score >= 1.8) return 'from-purple-500 to-purple-300';
  if (score >= 1.2) return 'from-purple-700 to-purple-500';
  return 'from-slate-600 to-slate-500';
}

function getScoreLabel(score: number): string {
  if (score >= 2.5) return 'Elite';
  if (score >= 1.8) return 'Excelente';
  if (score >= 1.2) return 'Sólido';
  if (score >= 0.8) return 'Regular';
  return 'Baixo';
}

export function BenchEfficiencyBar({
  score,
  maxScore = 3.5,
  showLabel = true,
}: BenchEfficiencyBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100);
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">BES</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-bold text-white">{score.toFixed(2)}</span>
          </div>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
