export type CalendarEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  source: 'mock' | 'google';
};

export type TodoItem = {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  dueDate?: string;
};

export type WeatherSnapshot = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  fetchedAt: string;
};

export type AppSettings = {
  city: string;
  latitude: number;
  longitude: number;
  weatherRefreshMinutes: number;
};