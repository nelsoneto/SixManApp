'use client';

interface SparkPlugBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export function SparkPlugBadge({ size = 'md' }: SparkPlugBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2 py-1 gap-1',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider
        bg-yellow-400/10 text-yellow-300 border border-yellow-400/40
        shadow-[0_0_8px_rgba(250,204,21,0.3)]
        ${sizeClasses[size]}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-label="Spark Plug"
        role="img"
        className={size === 'sm' ? 'h-2.5 w-2.5' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'}
      >
        <title>Spark Plug</title>
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
          clipRule="evenodd"
        />
      </svg>
      Spark Plug
    </span>
  );
}
