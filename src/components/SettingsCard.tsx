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
        <span className="text-muted-token text-lg">Offline behalten</span>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="text-secondary-token grid gap-2 text-lg">
          Ort
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="touch-input h-14 rounded-2xl px-4 py-4 text-2xl outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-secondary-token grid gap-2 text-lg">
            Latitude
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              className="touch-input h-14 rounded-2xl px-4 py-4 text-2xl outline-none"
            />
          </label>
          <label className="text-secondary-token grid gap-2 text-lg">
            Longitude
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              className="touch-input h-14 rounded-2xl px-4 py-4 text-2xl outline-none"
            />
          </label>
        </div>
        <label className="text-secondary-token grid gap-2 text-lg">
          Wetter Refresh in Minuten
          <input
            value={refresh}
            onChange={(event) => setRefresh(event.target.value)}
            className="touch-input h-14 rounded-2xl px-4 py-4 text-2xl outline-none"
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
          className="touch-btn-primary mt-2"
        >
          Speichern
        </button>
      </div>
    </section>
  );
}