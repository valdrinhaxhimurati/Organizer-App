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
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">Einkaufsliste</p>
        {checked.length > 0 && (
          <button
            type="button"
            onClick={clearChecked}
            className="rounded-full bg-white/5 px-4 py-2 text-lg text-zinc-400 transition hover:bg-white/10 hover:text-rose-300"
          >
            ✕ {checked.length} löschen
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
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
        />
        <button
          type="submit"
          disabled={!newLabel.trim()}
          className="rounded-2xl bg-emerald-600/70 px-5 py-3 text-2xl font-bold text-white transition hover:bg-emerald-500/80 disabled:opacity-30"
        >
          +
        </button>
      </form>

      {items.length === 0 && (
        <p className="mt-8 text-center text-xl text-zinc-600">Keine Artikel — füge etwas hinzu!</p>
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
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition',
          item.checked
            ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
            : 'border-zinc-500 text-zinc-500 hover:border-zinc-300',
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
