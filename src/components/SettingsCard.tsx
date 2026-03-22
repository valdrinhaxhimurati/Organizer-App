import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function SettingsCard() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [city, setCity] = useState(settings.city);
  const [latitude, setLatitude] = useState(String(settings.latitude));
  const [longitude, setLongitude] = useState(String(settings.longitude));
  const [refresh, setRefresh] = useState(String(settings.weatherRefreshMinutes));

  return (
    <section className="panel p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">Settings</p>
        <span className="text-lg text-zinc-400">Offline behalten</span>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-lg text-zinc-300">
          Ort
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-2xl text-white outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2 text-lg text-zinc-300">
            Latitude
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-2xl text-white outline-none"
            />
          </label>
          <label className="grid gap-2 text-lg text-zinc-300">
            Longitude
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-2xl text-white outline-none"
            />
          </label>
        </div>
        <label className="grid gap-2 text-lg text-zinc-300">
          Wetter Refresh in Minuten
          <input
            value={refresh}
            onChange={(event) => setRefresh(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-2xl text-white outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() =>
            updateSettings({
              city,
              latitude: Number(latitude),
              longitude: Number(longitude),
              weatherRefreshMinutes: Number(refresh)
            })
          }
          className="mt-2 rounded-3xl bg-cyan-300 px-6 py-4 text-2xl font-semibold text-slate-950"
        >
          Speichern
        </button>
      </div>
    </section>
  );
}