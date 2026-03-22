import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '../lib/utils';

export function ClockCard() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="panel relative overflow-hidden p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.16),_transparent_35%)]" />
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div>
          <p className="panel-title">Heute</p>
          <h1 className="mt-4 text-7xl font-semibold tracking-tight text-white">{formatTime(now)}</h1>
        </div>
        <p className="text-2xl text-zinc-300 capitalize">{formatDate(now)}</p>
      </div>
    </section>
  );
}