import type { CalendarEvent } from '../lib/types';

const KEY = 'organizer-local-events';

type Stored = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
};

function read(): Stored[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored[]) : [];
  } catch {
    return [];
  }
}

function write(events: Stored[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function getLocalEvents(): CalendarEvent[] {
  return read().map((e) => ({ ...e, source: 'local' as const }));
}

export function addLocalEvent(ev: Omit<Stored, 'id'>): CalendarEvent {
  const stored = read();
  const newEv: Stored = {
    ...ev,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
  write([...stored, newEv]);
  return { ...newEv, source: 'local' };
}

export function deleteLocalEvent(id: string): void {
  write(read().filter((e) => e.id !== id));
}
