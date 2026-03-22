import type { CalendarEvent } from '../lib/types';
import { formatTime } from '../lib/utils';

type Props = {
  weekEvents: CalendarEvent[];
};

function dayAbbr(dateStr: string) {
  return new Intl.DateTimeFormat('de-CH', { weekday: 'short' }).format(new Date(dateStr));
}

function dayNum(dateStr: string) {
  return new Date(dateStr).getDate();
}

export function WeekCard({ weekEvents }: Props) {
  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(99,102,241,0.09),transparent)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="panel-title text-indigo-400/60">Diese Woche</p>
          <span className="rounded-full bg-indigo-400/10 px-3 py-1 text-sm font-bold text-indigo-300/70">
            {weekEvents.length} {weekEvents.length === 1 ? 'Termin' : 'Termine'}
          </span>
        </div>
        <div className="mt-6 space-y-2.5">
          {weekEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.07] px-6 py-10 text-center">
              <p className="text-xl text-white/30">Diese Woche keine Termine</p>
            </div>
          ) : (
            weekEvents.map((event) => (
              <article key={event.id} className="flex items-center gap-4 rounded-2xl bg-white/[0.04] px-4 py-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-500/15">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-indigo-300/70">
                    {dayAbbr(event.startsAt)}
                  </span>
                  <span className="tabular-nums text-xl font-bold leading-tight text-white">
                    {dayNum(event.startsAt)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-0.5 text-base text-white/40">
                    {formatTime(new Date(event.startsAt))}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}