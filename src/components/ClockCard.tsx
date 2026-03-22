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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_10%_40%,rgba(59,130,246,0.10),transparent)]" />
      <div className="relative flex h-full min-h-[200px] flex-col justify-between gap-4">
        <p className="panel-title text-blue-300/55">Uhr</p>
        <h1
          className="text-primary-token tabular-nums leading-none font-black tracking-tight"
          style={{ fontSize: 'clamp(4.5rem, 9vw, 8rem)' }}
        >
          {formatTime(now)}
        </h1>
        <p className="text-secondary-token text-xl font-semibold capitalize">{formatDate(now)}</p>
      </div>
    </section>
  );
}