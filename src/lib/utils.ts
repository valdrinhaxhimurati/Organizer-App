export function formatTime(date: Date) {
  return new Intl.DateTimeFormat('de-CH', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(value));
}

export function weatherLabel(code: number) {
  if (code === 0) return 'Klar';
  if ([1, 2, 3].includes(code)) return 'Leicht bewölkt';
  if ([45, 48].includes(code)) return 'Nebel';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Regen';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Schnee';
  if ([95, 96, 99].includes(code)) return 'Gewitter';
  return 'Wechselhaft';
}

export function dayBounds(days: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  return { start, end };
}