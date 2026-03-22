import type { CalendarEvent } from '../lib/types';

const now = new Date();

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  return [
    {
      id: '1',
      title: 'Schulweg und Znuni checken',
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 15).toISOString(),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 45).toISOString(),
      location: 'Eingang',
      source: 'mock'
    },
    {
      id: '2',
      title: 'Wocheneinkauf planen',
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 30).toISOString(),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 15).toISOString(),
      location: 'Kueche',
      source: 'mock'
    },
    {
      id: '3',
      title: 'Sporttaschen vorbereiten',
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 20, 0).toISOString(),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 20, 30).toISOString(),
      source: 'mock'
    },
    {
      id: '4',
      title: 'Familienabend',
      startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 19, 0).toISOString(),
      endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 21, 0).toISOString(),
      location: 'Wohnzimmer',
      source: 'mock'
    }
  ];
}