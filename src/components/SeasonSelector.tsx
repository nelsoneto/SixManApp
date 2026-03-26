'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_SEASON, SEASONS } from '@/types';

export function SeasonSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSeason = searchParams.get('season') ?? DEFAULT_SEASON.value;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('season', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={currentSeason}
      onChange={handleChange}
      className="rounded-lg border border-purple-800/50 bg-[#13131A] px-3 py-1.5 text-sm font-medium text-slate-200 outline-none cursor-pointer hover:border-purple-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-colors duration-200"
    >
      {SEASONS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
