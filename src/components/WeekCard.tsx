import type { CalendarEvent } from '../lib/types';
import { formatShortDate, formatTime } from '../lib/utils';

type Props = {
  weekEvents: CalendarEvent[];
};

export function WeekCard({ weekEvents }: Props) {
  return (
    <section className="panel p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">Diese Woche</p>
        <span className="text-lg text-zinc-400">Google Calendar ready</span>
      </div>
      <div className="mt-6 space-y-3">
        {weekEvents.map((event) => (
          <article key={event.id} className="flex items-center gap-4 rounded-3xl border border-white/8 bg-black/15 px-4 py-4">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white/8 text-center">
              <span className="text-xs uppercase tracking-[0.28em] text-zinc-400">Tag</span>
              <span className="mt-1 text-xl font-semibold text-white">{formatShortDate(event.startsAt)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-2xl font-medium text-white">{event.title}</h3>
              <p className="mt-1 truncate text-lg text-zinc-400">
                {formatTime(new Date(event.startsAt))} · {event.location ?? 'Familie'}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}