import type { CalendarEvent } from '../lib/types';

type GraphEvent = {
  id: string;
  subject?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: { displayName?: string };
  isAllDay?: boolean;
};

/** Parse Graph datetime (local time, no offset) to ISO UTC string.
 *  We request UTC via Prefer header, so the string is already UTC without 'Z'. */
function toIso(dt: string): string {
  if (!dt) return new Date().toISOString();
  if (dt.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dt)) return dt;
  return dt.replace(/(\.\d+)?$/, '') + 'Z';
}

export async function fetchOutlookEvents(days = 14): Promise<CalendarEvent[]> {
  const [{ Client }, { getAccessToken }] = await Promise.all([
    import('@microsoft/microsoft-graph-client'),
    import('../lib/msal'),
  ]);

  const client = Client.init({
    authProvider: async (done) => {
      const token = await getAccessToken();
      token ? done(null, token) : done(new Error('Kein Zugriffstoken'), null);
    },
  });

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + days);

  try {
    const response = (await client
      .api('/me/calendarView')
      .header('Prefer', 'outlook.timezone="UTC"')
      .query({
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        $select: 'id,subject,start,end,location,isAllDay',
        $orderby: 'start/dateTime',
        $top: 100,
      })
      .get()) as { value: GraphEvent[] };

    return response.value.map(
      (evt): CalendarEvent => ({
        id: evt.id,
        title: evt.subject ?? '(kein Titel)',
        startsAt: toIso(evt.start.dateTime),
        endsAt: toIso(evt.end.dateTime),
        location: evt.location?.displayName || undefined,
        source: 'outlook',
      }),
    );
  } catch (err) {
    console.error('[Outlook] Kalender konnte nicht geladen werden:', err);
    return [];
  }
}
