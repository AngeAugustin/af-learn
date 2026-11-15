export function ProgressBar({ value, label, className = "" }: { value: number; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-border ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label}
    >
      <div className="progress-fill h-full rounded-full transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 72, stroke = 7, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
        />
      </svg>
      <span className="absolute text-base font-bold tracking-tight text-fg" aria-label={label}>
        {v} %
      </span>
    </div>
  );
}

/** Barre segmentée : un segment par module, rempli selon sa progression. */
export function SegmentedProgress({ segments }: { segments: { value: number; label: string }[] }) {
  return (
    <div className="flex gap-1.5" role="list" aria-label="Progression par module">
      {segments.map((s, i) => (
        <div key={i} role="listitem" className="h-1.5 flex-1 overflow-hidden rounded-full bg-border" title={`${s.label} : ${s.value} %`}>
          <div className="progress-fill h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, s.value))}%` }} />
        </div>
      ))}
    </div>
  );
}
