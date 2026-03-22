import { useQuery } from '@tanstack/react-query';
import { weatherLabel } from '../lib/utils';
import { getWeather } from '../services/weather';
import { useSettingsStore } from '../store/settingsStore';

export function WeatherCard() {
  const settings = useSettingsStore((state) => state.settings);
  const query = useQuery({
    queryKey: ['weather', settings.latitude, settings.longitude],
    queryFn: () => getWeather(settings.latitude, settings.longitude),
    refetchInterval: settings.weatherRefreshMinutes * 60 * 1000
  });

  return (
    <section className="panel p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="panel-title">Wetter</p>
          <h2 className="mt-4 text-5xl font-semibold text-white">
            {query.data ? `${Math.round(query.data.temperature)}°` : '--°'}
          </h2>
          <p className="mt-3 text-xl text-zinc-300">
            {query.data ? weatherLabel(query.data.weatherCode) : 'Lade Wetterdaten'}
          </p>
        </div>
        <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-lg text-emerald-200">
          {settings.city}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 text-lg text-zinc-300">
        <div className="rounded-2xl bg-white/6 p-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Wind</p>
          <p className="mt-2 text-2xl text-white">{query.data ? `${Math.round(query.data.windSpeed)} km/h` : '--'}</p>
        </div>
        <div className="rounded-2xl bg-white/6 p-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Zuletzt</p>
          <p className="mt-2 text-2xl text-white">
            {query.data
              ? new Date(query.data.fetchedAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
              : '--'}
          </p>
        </div>
      </div>
    </section>
  );
}