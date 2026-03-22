import type { CalendarEvent } from '../lib/types';
import { formatTime } from '../lib/utils';

type Props = {
  todayEvents: CalendarEvent[];
};

export function TodayCard({ todayEvents }: Props) {
  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(245,158,11,0.06),transparent)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="panel-title text-slate-300/55">Heute im Fokus</p>
          <span className="chip-warning rounded-full px-3 py-1 text-sm font-bold text-amber-200/85">
            {todayEvents.length} {todayEvents.length === 1 ? 'Termin' : 'Termine'}
          </span>
        </div>
        <div className="mt-6 space-y-3">
          {todayEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.07] px-6 py-10 text-center">
              <p className="text-faint-token text-xl">Heute kein Termin</p>
            </div>
          ) : (
            todayEvents.map((event) => (
              <article
                key={event.id}
                className="flex items-start gap-4 overflow-hidden rounded-2xl border border-slate-400/10 bg-white/[0.03] px-5 py-4"
              >
                <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-amber-400/70" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-primary-token truncate text-2xl font-semibold">{event.title}</h3>
                  {event.location && (
                    <p className="text-secondary-token mt-1 truncate text-base">{event.location}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-primary-token text-xl font-bold tabular-nums">
                    {formatTime(new Date(event.startsAt))}
                  </p>
                  <p className="text-muted-token text-sm tabular-nums">
                    – {formatTime(new Date(event.endsAt))}
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