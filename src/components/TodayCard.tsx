import type { CalendarEvent } from '../lib/types';
import { formatTime } from '../lib/utils';

type Props = {
  todayEvents: CalendarEvent[];
};

export function TodayCard({ todayEvents }: Props) {
  return (
    <section className="panel p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">Heute im Fokus</p>
        <span className="rounded-full bg-sky-400/10 px-4 py-2 text-lg text-sky-200">
          {todayEvents.length} Termine
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {todayEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 px-6 py-10 text-center text-xl text-zinc-400">
            Kein fester Termin heute.
          </div>
        ) : (
          todayEvents.map((event) => (
            <article key={event.id} className="rounded-3xl bg-white/5 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-medium text-white">{event.title}</h3>
                  <p className="mt-1 text-lg text-zinc-400">{event.location ?? 'Zuhause'}</p>
                </div>
                <div className="text-right text-lg text-zinc-300">
                  <p>{formatTime(new Date(event.startsAt))}</p>
                  <p className="text-zinc-500">bis {formatTime(new Date(event.endsAt))}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}