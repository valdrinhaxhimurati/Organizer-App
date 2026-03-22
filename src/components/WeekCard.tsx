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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(59,130,246,0.08),transparent)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="panel-title text-slate-300/55">Diese Woche</p>
          <span className="rounded-full border border-blue-400/15 bg-blue-400/[0.08] px-3 py-1 text-sm font-bold text-blue-200/80">
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
              <article key={event.id} className="flex items-center gap-4 rounded-2xl border border-slate-400/10 bg-white/[0.03] px-4 py-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/[0.08]">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-blue-200/75">
                    {dayAbbr(event.startsAt)}
                  </span>
                  <span className="tabular-nums text-xl font-bold leading-tight text-white">
                    {dayNum(event.startsAt)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-semibold text-white">{event.title}</h3>
                  <p className="mt-0.5 text-base text-slate-300/55">
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