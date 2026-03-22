import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { isMsalConfigured, msalSignIn, msalSignOut } from '../lib/msal';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

/* ─── Weather section ────────────────────────────────────────────────────── */
function WeatherSettings() {
  const { settings, updateSettings } = useSettingsStore();
  const [city, setCity] = useState(settings.city);
  const [lat, setLat] = useState(String(settings.latitude));
  const [lon, setLon] = useState(String(settings.longitude));
  const [refresh, setRefresh] = useState(String(settings.weatherRefreshMinutes));
  const [saved, setSaved] = useState(false);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude.toFixed(4));
      setLon(pos.coords.longitude.toFixed(4));
    });
  }

  function save() {
    updateSettings({
      city: city.trim() || 'Zuerich',
      latitude: parseFloat(lat) || 47.3769,
      longitude: parseFloat(lon) || 8.5417,
      weatherRefreshMinutes: parseInt(refresh, 10) || 15,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className="panel p-8">
      <p className="panel-title mb-6">🌤 Wetter</p>

      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-xl text-zinc-300">Ort / Stadt</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="touch-input"
            placeholder="z.B. Zuerich"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-xl text-zinc-300">Breitengrad</span>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="touch-input"
              placeholder="47.3769"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xl text-zinc-300">Längengrad</span>
            <input
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="touch-input"
              placeholder="8.5417"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={useCurrentLocation}
          className="touch-btn-secondary"
        >
          📍 Meinen Standort verwenden
        </button>

        <label className="grid gap-2">
          <span className="text-xl text-zinc-300">Aktualisierungsintervall</span>
          <select
            value={refresh}
            onChange={(e) => setRefresh(e.target.value)}
            className="touch-input"
          >
            <option value="5">Alle 5 Minuten</option>
            <option value="10">Alle 10 Minuten</option>
            <option value="15">Alle 15 Minuten</option>
            <option value="30">Alle 30 Minuten</option>
            <option value="60">Jede Stunde</option>
          </select>
        </label>

        <button type="button" onClick={save} className="touch-btn-primary">
          {saved ? '✓ Gespeichert!' : 'Einstellungen speichern'}
        </button>
      </div>
    </section>
  );
}

/* ─── Outlook calendar section ───────────────────────────────────────────── */
function OutlookSettings() {
  const { account, setAccount } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function connect() {
    setLoading(true);
    setError('');
    try {
      const acc = await msalSignIn();
      setAccount(acc);
      if (!acc) setError('Anmeldung wurde abgebrochen oder ist fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }

  async function disconnect() {
    setLoading(true);
    try {
      await msalSignOut();
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }

  if (!isMsalConfigured) {
    return (
      <section className="panel p-8">
        <p className="panel-title mb-4">📅 Outlook Kalender</p>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/8 p-6">
          <p className="text-xl text-amber-200">
            Azure-App-ID fehlt. Trage{' '}
            <code className="rounded bg-white/10 px-2 py-0.5 text-amber-100">
              VITE_MSAL_CLIENT_ID
            </code>{' '}
            in die <code className="rounded bg-white/10 px-2 py-0.5 text-amber-100">.env</code>-Datei
            ein und starte die App neu.
          </p>
          <p className="mt-3 text-lg text-zinc-400">
            Registriere eine App im{' '}
            <strong className="text-zinc-200">Azure Portal → App-Registrierungen</strong>, füge
            die Redirect-URI <code className="text-zinc-300">{window.location.origin}</code> hinzu
            und kopiere die Anwendungs-(Client-)ID.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel p-8">
      <p className="panel-title mb-6">📅 Outlook Kalender</p>

      {account ? (
        <div className="grid gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/8 p-5">
            <span className="text-4xl">✓</span>
            <div>
              <p className="text-2xl font-semibold text-emerald-200">{account.name ?? account.username}</p>
              <p className="text-xl text-zinc-400">{account.username}</p>
            </div>
          </div>
          <p className="text-xl text-zinc-400">
            Kalenderereignisse der nächsten 14 Tage werden automatisch angezeigt.
          </p>
          <button
            type="button"
            onClick={disconnect}
            disabled={loading}
            className="touch-btn-danger"
          >
            {loading ? 'Wird abgemeldet…' : 'Microsoft-Konto trennen'}
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <p className="text-xl text-zinc-300">
              Verbinde dein Microsoft-Konto, um Outlook-Kalendertermine direkt auf dem
              Dashboard anzuzeigen.
            </p>
            <p className="mt-3 text-lg text-zinc-500">
              Benötigte Berechtigung: <span className="text-zinc-400">Calendars.Read</span>
            </p>
          </div>
          {error && (
            <p className="rounded-xl border border-rose-400/20 bg-rose-400/8 p-4 text-xl text-rose-300">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={connect}
            disabled={loading}
            className="touch-btn-primary"
          >
            {loading ? 'Anmeldung läuft…' : '🔑 Mit Microsoft anmelden'}
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Data management section ────────────────────────────────────────────── */
function DataSettings() {
  const [cleared, setCleared] = useState<'todos' | 'shopping' | null>(null);

  function clearDoneTodos() {
    const raw = localStorage.getItem('organizer-local-todos');
    if (!raw) return;
    const todos = JSON.parse(raw) as Array<{ done: boolean }>;
    const filtered = todos.filter((t) => !t.done);
    localStorage.setItem('organizer-local-todos', JSON.stringify(filtered));
    setCleared('todos');
    setTimeout(() => setCleared(null), 2500);
  }

  function clearShopping() {
    localStorage.removeItem('organizer-shopping');
    setCleared('shopping');
    setTimeout(() => setCleared(null), 2500);
  }

  return (
    <section className="panel p-8">
      <p className="panel-title mb-6">🗂 Daten verwalten</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button type="button" onClick={clearDoneTodos} className="touch-btn-secondary">
          {cleared === 'todos' ? '✓ Erledigt!' : '🗑 Erledigte To-dos löschen'}
        </button>
        <button type="button" onClick={clearShopping} className="touch-btn-secondary">
          {cleared === 'shopping' ? '✓ Erledigt!' : '🗑 Einkaufsliste leeren'}
        </button>
      </div>
    </section>
  );
}

/* ─── Main Settings page ─────────────────────────────────────────────────── */
export function SettingsPage() {
  return (
    <main className="min-h-screen px-6 py-6 text-white xl:px-8">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6">
        <NavBar />
        <div className="flex flex-col gap-6 pb-12">
          <WeatherSettings />
          <OutlookSettings />
          <DataSettings />
        </div>
      </div>
    </main>
  );
}
