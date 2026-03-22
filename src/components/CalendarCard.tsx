import { useMemo, useState } from 'react';
import type { CalendarEvent } from '../lib/types';
import { addLocalEvent, getLocalEvents } from '../services/localEvents';

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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CalendarCard({ events }: Props) {
  const todayStr = useMemo(() => toDateStr(new Date()), []);
  const now = new Date();

  const [viewMonth, setViewMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(getLocalEvents);

  /* form state */
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formStart, setFormStart] = useState('09:00');
  const [formEnd, setFormEnd] = useState('10:00');
  const [formLocation, setFormLocation] = useState('');

  const monthLabel = viewMonth.toLocaleDateString('de-CH', { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  const allEvents = useMemo(() => [...events, ...localEvents], [events, localEvents]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of allEvents) {
      const key = ev.startsAt.slice(0, 10);
      (map[key] ??= []).push(ev);
    }
    return map;
  }, [allEvents]);

  const selectedLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const isCurrentMonth =
    viewMonth.getMonth() === now.getMonth() && viewMonth.getFullYear() === now.getFullYear();

  function openForm() {
    setShowForm(true);
    setFormTitle('');
    setFormStart('09:00');
    setFormEnd('10:00');
    setFormLocation('');
  }

  function closeForm() {
    setShowForm(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const title = formTitle.trim();
    if (!title) return;
    const ev = addLocalEvent({
      title,
      startsAt: `${selectedDate}T${formStart}:00`,
      endsAt: `${selectedDate}T${formEnd}:00`,
      location: formLocation.trim() || undefined,
    });
    setLocalEvents((prev) => [...prev, ev]);
    closeForm();
  }

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(59,130,246,0.09),transparent)]" />

      <div className="relative flex flex-col gap-6">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <p className="panel-title text-blue-300/55">Kalender</p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="text-muted-token flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-white/[0.07] hover:text-current active:scale-95"
              aria-label="Vorheriger Monat"
            >
              <ChevronLeft />
            </button>
            <span className="text-primary-token min-w-[11rem] text-center text-base font-bold capitalize">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="text-muted-token flex h-12 w-12 items-center justify-center rounded-xl transition hover:bg-white/[0.07] hover:text-current active:scale-95"
              aria-label="Nächster Monat"
            >
              <ChevronRight />
            </button>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={() => {
                  setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                  setSelectedDate(todayStr);
                  setShowForm(false);
                }}
                className="text-muted-token h-12 rounded-xl border border-slate-400/12 px-4 text-sm transition hover:bg-white/[0.06] hover:text-slate-200 active:scale-95"
              >
                Heute
              </button>
            )}
            {/* Add-appointment button */}
            <button
              type="button"
              onClick={showForm ? closeForm : openForm}
              className={[
                'ml-1 flex h-12 w-12 items-center justify-center rounded-xl transition active:scale-95',
                showForm
                  ? 'surface-subtle text-muted-token hover:bg-white/[0.12]'
                  : 'bg-blue-500/85 text-white hover:bg-blue-500',
              ].join(' ')}
              aria-label={showForm ? 'Abbrechen' : 'Neuer Termin'}
            >
              {showForm ? <XIcon /> : <PlusIcon />}
            </button>
          </div>
        </div>

        {/* ── Add-event form (slides in below header) ─────────────── */}
        {showForm && (
          <form
            onSubmit={handleSave}
            className="flex flex-col gap-3 rounded-2xl border border-blue-400/15 bg-blue-400/[0.06] p-5"
          >
            <p className="text-secondary-token mb-1 text-sm font-semibold capitalize">{selectedLabel}</p>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Titel *"
              autoFocus
              required
              className="touch-input"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-faint-token mb-1.5 block text-[0.6rem] font-bold uppercase tracking-widest">
                  Von
                </label>
                <input
                  type="time"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="touch-input"
                />
              </div>
              <div>
                <label className="text-faint-token mb-1.5 block text-[0.6rem] font-bold uppercase tracking-widest">
                  Bis
                </label>
                <input
                  type="time"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="touch-input"
                />
              </div>
            </div>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="Ort (optional)"
              className="touch-input"
            />
            <div className="mt-1 grid grid-cols-2 gap-3">
              <button type="button" onClick={closeForm} className="touch-btn-secondary">
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={!formTitle.trim()}
                className="flex h-16 w-full items-center justify-center rounded-2xl bg-blue-500/85 px-6 text-xl font-semibold text-white transition hover:bg-blue-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Speichern
              </button>
            </div>
          </form>
        )}

        {/* ── Weekday labels ──────────────────────────────────────── */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-faint-token py-2 text-center text-[0.6rem] font-bold uppercase tracking-[0.3em]"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* ── Day cells — h-12 = 48px touch target ───────────────── */}
        <div className="-mt-4 grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const ds = toDateStr(day);
            const isToday = ds === todayStr;
            const isSel = ds === selectedDate;
            const hasEvents = !!eventsByDate[ds]?.length;
            const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const isPast = day < today0;

            return (
              <button
                key={ds}
                type="button"
                onClick={() => {
                  setSelectedDate(ds);
                  setShowForm(false);
                }}
                className={[
                  'relative flex h-12 flex-col items-center justify-center rounded-xl text-lg tabular-nums transition focus:outline-none active:scale-95',
                  isSel
                    ? 'bg-blue-500/85 font-bold text-white shadow-md'
                    : isToday
                      ? 'bg-blue-400/12 font-bold text-blue-200 ring-1 ring-blue-400/25'
                      : isPast
                        ? 'text-white/22 hover:bg-white/[0.04]'
                        : 'text-white/70 hover:bg-white/[0.07]',
                ].join(' ')}
              >
                {day.getDate()}
                {hasEvents && (
                  <span
                    className={[
                      'absolute bottom-1.5 h-1 w-1 rounded-full',
                      isSel ? 'bg-white/60' : 'bg-blue-400/70',
                    ].join(' ')}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
