import { useRef, useState } from 'react';

type ShopItem = {
  id: string;
  label: string;
  checked: boolean;
};

const STORAGE_KEY = 'organizer-shopping';

function readItems(): ShopItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ShopItem[]) : [];
  } catch {
    return [];
  }
}

function writeItems(items: ShopItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function ShoppingCard() {
  const [items, setItems] = useState<ShopItem[]>(readItems);
  const [newLabel, setNewLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function persist(next: ShopItem[]) {
    setItems(next);
    writeItems(next);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    persist([{ id: `item-${Date.now()}`, label, checked: false }, ...items]);
    setNewLabel('');
    inputRef.current?.focus();
  }

  function toggle(id: string) {
    persist(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  function remove(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  function clearChecked() {
    persist(items.filter((i) => !i.checked));
  }

  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(59,130,246,0.07),transparent)]" />
      <div className="relative">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title text-blue-300/55">Einkaufsliste</p>
        {checked.length > 0 && (
          <button
            type="button"
            onClick={clearChecked}
            className="rounded-full border border-slate-400/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-slate-300/55 transition hover:bg-rose-400/12 hover:text-rose-200"
          >
            ✕ {checked.length} löschen
          </button>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mt-5 flex gap-3">
        <input
          ref={inputRef}
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Artikel hinzufügen…"
          className="h-14 flex-1 min-w-0 rounded-xl border border-slate-400/12 bg-white/[0.04] px-5 text-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/35"
        />
        <button
          type="submit"
          disabled={!newLabel.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/85 text-3xl font-bold text-white transition hover:bg-blue-500 disabled:opacity-30"
        >
          +
        </button>
      </form>

      {items.length === 0 && (
        <p className="mt-8 text-center text-xl text-white/25">Keine Artikel — füge etwas hinzu!</p>
      )}

      {/* Unchecked items */}
      <div className="mt-5 space-y-2">
        {unchecked.map((item) => (
          <Row key={item.id} item={item} onToggle={toggle} onRemove={remove} />
        ))}
      </div>

      {/* Checked items (greyed out) */}
      {checked.length > 0 && (
        <div className="mt-4 space-y-2 opacity-50">
          {checked.map((item) => (
            <Row key={item.id} item={item} onToggle={toggle} onRemove={remove} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}

function Row({
  item,
  onToggle,
  onRemove,
}: {
  item: ShopItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-400/10 bg-white/[0.03] px-4 py-3.5">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition',
          item.checked
            ? 'border-emerald-400/45 bg-emerald-400/12 text-emerald-200'
            : 'border-white/20 text-white/20 hover:border-white/50',
        ].join(' ')}
      >
        {item.checked ? '✓' : ''}
      </button>
      <span
        className={
          item.checked
            ? 'flex-1 text-xl text-zinc-500 line-through'
            : 'flex-1 text-xl text-white'
        }
      >
        {item.label}
      </span>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-zinc-600 transition hover:text-rose-300"
        aria-label="Entfernen"
      >
        ✕
      </button>
    </div>
  );
}
