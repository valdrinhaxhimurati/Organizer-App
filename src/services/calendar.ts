import type { CalendarEvent } from '../lib/types';
import { fetchOutlookEvents } from './outlook';
import { useAuthStore } from '../store/authStore';

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const account = useAuthStore.getState().account;
  if (account) {
    const events = await fetchOutlookEvents(14);
    if (events.length > 0) return events;
    // fall through to mock data if fetch returned nothing
  }
  return getMockEvents();
}

function getMockEvents(): CalendarEvent[] {
  const now = new Date();
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
    },
  ];
}