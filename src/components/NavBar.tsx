import { NavLink } from 'react-router-dom';

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

export function NavBar() {
  const tab = (isActive: boolean) =>
    [
      'flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-[0.92rem] font-semibold tracking-wide transition-all duration-150',
      isActive ? 'bg-white/[0.09] text-white' : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]',
    ].join(' ');

  return (
    <nav className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 backdrop-blur-sm">
      <span className="mr-auto select-none pl-2 text-[1.05rem] font-extrabold tracking-tight text-white/50">
        Familienplaner
      </span>
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
