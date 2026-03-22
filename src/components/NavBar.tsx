import { NavLink } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export function NavBar() {
  const theme = useSettingsStore((state) => state.settings.theme);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const tab = (isActive: boolean) =>
    [
      'flex min-h-12 items-center gap-2.5 rounded-xl px-5 py-2.5 text-[0.92rem] font-semibold tracking-wide transition-all duration-150',
      isActive
        ? 'border border-blue-400/20 bg-blue-400/[0.10] text-primary-token shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]',
    ].join(' ');

  return (
    <nav className="flex items-center gap-2 rounded-2xl border border-slate-400/10 bg-slate-950/20 px-3 py-3 backdrop-blur-md">
      <span className="text-muted-token mr-auto select-none pl-2 text-[1.05rem] font-extrabold tracking-tight">
        Familienplaner
      </span>
      <div className="segmented mr-1" aria-label="Theme umschalten">
        <button
          type="button"
          title="Dunkel"
          aria-label="Dunklen Modus aktivieren"
          onClick={() => updateSettings({ theme: 'dark' })}
          className={['segmented-option px-3', theme === 'dark' ? 'is-active' : ''].join(' ')}
        >
          <MoonIcon />
        </button>
        <button
          type="button"
          title="Hell"
          aria-label="Hellen Modus aktivieren"
          onClick={() => updateSettings({ theme: 'light' })}
          className={['segmented-option px-3', theme === 'light' ? 'is-active' : ''].join(' ')}
        >
          <SunIcon />
        </button>
      </div>
      <NavLink to="/" end className={({ isActive }) => tab(isActive)}>
        <GridIcon />
        Dashboard
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => tab(isActive)}>
        <GearIcon />
        Einstellungen
      </NavLink>
    </nav>
  );
}
