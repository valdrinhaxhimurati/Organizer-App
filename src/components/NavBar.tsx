import { NavLink } from 'react-router-dom';

export function NavBar() {
  const base =
    'flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-3 text-lg font-semibold tracking-wide transition-colors active:scale-[0.97]';
  const active = 'bg-white/10 text-white';
  const inactive = 'text-zinc-500 hover:text-zinc-300';

  return (
    <nav className="mb-6 flex h-20 items-center gap-3 rounded-[2rem] border border-white/8 bg-white/4 px-4 backdrop-blur-xl">
      {/* Logo / app name */}
      <span className="mr-2 select-none text-2xl font-bold tracking-tight text-white/80">
        🏠 Organizer
      </span>

      <div className="flex flex-1 gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="text-3xl">⊞</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
        >
          <span className="text-3xl">⚙︎</span>
          <span>Einstellungen</span>
        </NavLink>
      </div>
    </nav>
  );
}
