import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '../lib/utils';

export function ClockCard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="panel p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_10%_50%,rgba(99,102,241,0.16),transparent)]" />
      <div className="relative flex h-full min-h-[200px] flex-col justify-between gap-4">
        <p className="panel-title text-indigo-400/60">Uhr</p>
        <h1
          className="tabular-nums leading-none font-black tracking-tight text-white"
          style={{ fontSize: 'clamp(4.5rem, 9vw, 8rem)' }}
        >
          {formatTime(now)}
        </h1>
        <p className="text-xl font-semibold capitalize text-white/40">{formatDate(now)}</p>
      </div>
    </section>
  );
}