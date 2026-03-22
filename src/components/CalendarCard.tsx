import { useMemo, useState } from 'react';
import type { CalendarEvent } from '../lib/types';
import { formatTime } from '../lib/utils';

type Props = { events: CalendarEvent[] };

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function toDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function CalendarCard({ events }: Props) {
  const todayStr = useMemo(() => toDateStr(new Date()), []);

  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const monthLabel = viewMonth.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' });

  /* Build grid cells for the month (7 cols, Mon-first) */
  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDow = firstDay.getDay(); // 0 = Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // Mon = 0

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [viewMonth]);

  /* Group events by ISO date string */
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      const key = ev.startsAt.slice(0, 10);
      (map[key] ??= []).push(ev);
    }
    return map;
  }, [events]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  const selectedLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(139,92,246,0.10),transparent)]" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_minmax(240px,300px)]">

        {/* ── Month grid ──────────────────────────────────────────── */}
        <div>
          {/* Header */}
          <div className="mb-5 flex items-center gap-2">
            <p className="panel-title text-violet-400/60">Kalender</p>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.07] hover:text-white/80"
                aria-label="Vorheriger Monat"
              >
                <ChevronLeft />
              </button>
              <span className="min-w-[10rem] text-center text-sm font-semibold capitalize text-white/75">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.07] hover:text-white/80"
                aria-label="Nächster Monat"
              >
                <ChevronRight />
              </button>
              {/* Jump to today */}
              {viewMonth.getMonth() !== new Date().getMonth() || viewMonth.getFullYear() !== new Date().getFullYear() ? (
                <button
                  type="button"
                  onClick={() => {
                    const n = new Date();
                    setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1));
                    setSelectedDate(todayStr);
                  }}
                  className="ml-2 rounded-lg border border-white/[0.08] px-3 py-1 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
                >
                  Heute
                </button>
              ) : null}
            </div>
          </div>

          {/* Weekday labels */}
          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map(wd => (
              <div key={wd} className="py-1.5 text-center text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/20">
                {wd}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;

              const ds = toDateStr(day);
              const isToday = ds === todayStr;
              const isSel = ds === selectedDate;
              const hasEvents = !!eventsByDate[ds]?.length;
              const now = new Date();
              const isPast = day < new Date(now.getFullYear(), now.getMonth(), now.getDate());

              return (
                <button
                  key={ds}
                  type="button"
                  onClick={() => setSelectedDate(ds)}
                  className={[
                    'relative flex flex-col items-center justify-center rounded-xl py-1.5 text-base tabular-nums transition focus:outline-none',
                    isSel
                      ? 'bg-violet-500/80 font-bold text-white shadow-md'
                      : isToday
                        ? 'bg-violet-400/15 font-bold text-violet-300 ring-1 ring-violet-400/30'
                        : isPast
                          ? 'text-white/20 hover:bg-white/[0.04]'
                          : 'text-white/65 hover:bg-white/[0.06]',
                  ].join(' ')}
                >
                  {day.getDate()}
                  {hasEvents && (
                    <span
                      className={[
                        'absolute bottom-1 h-1 w-1 rounded-full',
                        isSel ? 'bg-white/60' : 'bg-violet-400/70',
                      ].join(' ')}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Day detail ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 border-t border-white/[0.05] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold capitalize text-white/50">{selectedLabel}</p>
            {selectedEvents.length > 0 && (
              <span className="rounded-full bg-violet-400/10 px-2.5 py-0.5 text-xs font-bold tabular-nums text-violet-300/80">
                {selectedEvents.length}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: 230 }}>
            {selectedEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.07] px-4 py-8 text-center">
                <p className="text-sm text-white/25">Keine Termine</p>
              </div>
            ) : (
              selectedEvents.map(ev => (
                <article key={ev.id} className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-4 py-3.5">
                  <div className="mt-0.5 w-0.5 self-stretch shrink-0 rounded-full bg-violet-400/60" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{ev.title}</p>
                    <p className="mt-0.5 text-xs text-white/40">
                      {formatTime(new Date(ev.startsAt))} – {formatTime(new Date(ev.endsAt))}
                      {ev.location ? ` · ${ev.location}` : ''}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
