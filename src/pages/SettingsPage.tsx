import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { isMsalConfigured, msalSignIn, msalSignOut } from '../lib/msal';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

/* ─── SVG icon helpers ───────────────────────────────────────────────────── */
function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}
function LocateIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}
function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" rx="1" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" rx="1" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" rx="1" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" rx="1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}

/* ─── Reusable field label ───────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-white/35">{children}</span>;
}

/* ─── Section header ─────────────────────────────────────────────────────── */
function SectionHeader({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
  return (
    <div className={`mb-7 flex items-center gap-2.5 ${accent}`}>
      {icon}
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.42em] opacity-70">{label}</span>
    </div>
  );
}

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(16,185,129,0.08),transparent)]" />
      <div className="relative grid gap-6">
        <SectionHeader icon={<CloudIcon />} label="Wetter" accent="text-emerald-400" />

        <label className="grid gap-2">
          <FieldLabel>Ort / Stadt</FieldLabel>
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
            <FieldLabel>Breitengrad</FieldLabel>
            <input type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} className="touch-input" placeholder="47.3769" />
          </label>
          <label className="grid gap-2">
            <FieldLabel>Längengrad</FieldLabel>
            <input type="number" step="0.0001" value={lon} onChange={(e) => setLon(e.target.value)} className="touch-input" placeholder="8.5417" />
          </label>
        </div>

        <button type="button" onClick={useCurrentLocation} className="touch-btn-secondary gap-2">
          <LocateIcon />
          Aktuellen Standort verwenden
        </button>

        <label className="grid gap-2">
          <FieldLabel>Aktualisierungsintervall</FieldLabel>
          <select value={refresh} onChange={(e) => setRefresh(e.target.value)} className="touch-input">
            <option value="5">Alle 5 Minuten</option>
            <option value="10">Alle 10 Minuten</option>
            <option value="15">Alle 15 Minuten</option>
            <option value="30">Alle 30 Minuten</option>
            <option value="60">Jede Stunde</option>
          </select>
        </label>

        <button
          type="button"
          onClick={save}
          className={[
            'touch-btn-primary transition-all',
            saved ? 'bg-emerald-500/80 hover:bg-emerald-500/90' : '',
          ].join(' ')}
        >
          {saved ? (
            <span className="flex items-center gap-2"><CheckIcon /> Gespeichert!</span>
          ) : (
            'Speichern'
          )}
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(99,102,241,0.08),transparent)]" />
        <div className="relative">
          <SectionHeader icon={<CalendarIcon />} label="Outlook Kalender" accent="text-indigo-400" />
          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-6">
            <p className="text-base font-semibold text-amber-300/90">Azure App-ID fehlt</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Trage{' '}
              <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-white/70 font-mono text-xs">
                VITE_MSAL_CLIENT_ID
              </code>{' '}
              in die{' '}
              <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-white/70 font-mono text-xs">.env</code>{' '}
              Datei ein und starte die App neu.
            </p>
            <p className="mt-3 text-sm text-white/30">
              Azure Portal → App-Registrierungen → Redirect-URI:{' '}
              <code className="text-white/50">{window.location.origin}</code>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(99,102,241,0.08),transparent)]" />
      <div className="relative grid gap-6">
        <SectionHeader icon={<CalendarIcon />} label="Outlook Kalender" accent="text-indigo-400" />

        {account ? (
          <>
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckIcon />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">{account.name ?? account.username}</p>
                <p className="truncate text-sm text-white/40">{account.username}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/35">
              Termine der nächsten 14 Tage werden automatisch auf dem Dashboard angezeigt.
            </p>
            <button type="button" onClick={disconnect} disabled={loading} className="touch-btn-danger">
              {loading ? 'Wird getrennt…' : 'Konto trennen'}
            </button>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 text-sm leading-relaxed text-white/40">
              Verbinde dein Microsoft-Konto um Outlook-Kalendertermine direkt auf dem Dashboard anzuzeigen.
              <span className="mt-2 block text-white/25">Benötigte Berechtigung: Calendars.Read</span>
            </div>
            {error && (
              <p className="rounded-xl border border-rose-400/15 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-300/80">
                {error}
              </p>
            )}
            <button type="button" onClick={connect} disabled={loading} className="touch-btn-primary gap-3">
              <MicrosoftIcon />
              {loading ? 'Anmeldung läuft…' : 'Mit Microsoft anmelden'}
            </button>
          </>
        )}
      </div>
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
    const before = todos.length;
    const filtered = todos.filter((t) => !t.done);
    localStorage.setItem('organizer-local-todos', JSON.stringify(filtered));
    if (before - filtered.length > 0) {
      setCleared('todos');
      setTimeout(() => setCleared(null), 2500);
    }
  }

  function clearShopping() {
    localStorage.removeItem('organizer-shopping');
    setCleared('shopping');
    setTimeout(() => setCleared(null), 2500);
  }

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(14,165,233,0.07),transparent)]" />
      <div className="relative">
        <SectionHeader icon={<DatabaseIcon />} label="Lokale Daten" accent="text-sky-400" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={clearDoneTodos}
            className={[
              'touch-btn-secondary flex items-center justify-center gap-3 transition-colors',
              cleared === 'todos' && 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cleared === 'todos' ? (
              <>
                <CheckIcon /> Gelöscht
              </>
            ) : (
              <>
                <TrashIcon /> Erledigte To-dos löschen
              </>
            )}
          </button>
          <button
            type="button"
            onClick={clearShopping}
            className={[
              'touch-btn-secondary flex items-center justify-center gap-3 transition-colors',
              cleared === 'shopping' && 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cleared === 'shopping' ? (
              <>
                <CheckIcon /> Geleert
              </>
            ) : (
              <>
                <TrashIcon /> Einkaufsliste leeren
              </>
            )}
          </button>
        </div>
        <p className="mt-5 text-xs text-white/25">
          Alle Daten werden ausschließlich im Browser-Speicher dieses Geräts gespeichert.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Settings page ─────────────────────────────────────────────────── */
export function SettingsPage() {
  return (
    <main className="min-h-screen px-8 py-8 text-white xl:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
        <NavBar />
        <div className="grid grid-cols-1 gap-6 pb-12 xl:grid-cols-2">
          <WeatherSettings />
          <OutlookSettings />
          <div className="xl:col-span-2">
            <DataSettings />
          </div>
        </div>
      </div>
    </main>
  );
}
