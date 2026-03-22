import { useQuery } from '@tanstack/react-query';
import { weatherLabel } from '../lib/utils';
import { getWeather } from '../services/weather';
import { useSettingsStore } from '../store/settingsStore';

function weatherEmoji(code: number): string {
  if (code === 0) return '\u2600\uFE0F';
  if (code === 1) return '\uD83C\uDF24';
  if (code === 2) return '\u26C5';
  if (code === 3) return '\u2601\uFE0F';
  if ([45, 48].includes(code)) return '\uD83C\uDF2B';
  if ([51, 53, 55].includes(code)) return '\uD83C\uDF26';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return '\uD83C\uDF27';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '\u2744\uFE0F';
  if ([95, 96, 99].includes(code)) return '\u26C8';
  return '\uD83C\uDF21';
}

export function WeatherCard() {
  const settings = useSettingsStore((state) => state.settings);
  const query = useQuery({
    queryKey: ['weather', settings.latitude, settings.longitude],
    queryFn: () => getWeather(settings.latitude, settings.longitude),
    refetchInterval: settings.weatherRefreshMinutes * 60 * 1000,
  });

  const data = query.data;

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_10%,rgba(59,130,246,0.08),transparent)]" />
      <div className="relative">
        <p className="panel-title text-blue-300/55">Wetter · {settings.city}</p>
        <div className="mt-3 flex items-end gap-4">
          <span
            className="tabular-nums leading-none font-black text-white"
            style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}
          >
            {data ? `${Math.round(data.temperature)}°` : '--°'}
          </span>
          {data && (
            <span className="mb-1.5 text-5xl leading-none">{weatherEmoji(data.weatherCode)}</span>
          )}
        </div>
        <p className="mt-2.5 text-xl font-medium text-slate-300/55">
          {data ? weatherLabel(data.weatherCode) : 'Lade Wetterdaten…'}
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-400/10 bg-white/[0.03] p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.38em] text-slate-400/70">Wind</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-white">
              {data ? `${Math.round(data.windSpeed)} km/h` : '--'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-400/10 bg-white/[0.03] p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.38em] text-slate-400/70">Aktualisiert</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-white">
              {data
                ? new Date(data.fetchedAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
                : '--'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}