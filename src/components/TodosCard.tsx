import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import type { TodoItem } from '../lib/types';
import { addTodo, getTodos, toggleTodo, updateTodoDueDate } from '../services/todos';

function toDateInputValue(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function SortableRow({
  todo,
  onToggle,
  onDueDateChange,
}: {
  todo: TodoItem;
  onToggle: (id: string, done: boolean) => void;
  onDueDateChange: (id: string, dueDate?: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-400/10 bg-white/[0.03] px-4 py-3.5"
    >
      {/* drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-target-comfortable text-muted-token flex cursor-grab touch-none items-center justify-center rounded-xl hover:bg-white/[0.04] hover:text-slate-300 active:cursor-grabbing"
        aria-label="Ziehen zum Sortieren"
      >
        ⠿
      </button>

      {/* checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id, !todo.done)}
        className={[
          'touch-target-comfortable flex shrink-0 items-center justify-center rounded-full border text-base transition',
          todo.done
            ? 'border-emerald-400/45 bg-emerald-400/12 text-emerald-200'
            : 'border-slate-400/20 text-slate-400/40 hover:border-slate-400/50',
        ].join(' ')}
      >
        {todo.done ? '✓' : ''}
      </button>

      {/* title */}
      <span className="flex-1 text-left">
        <span
          className={
            todo.done ? 'text-faint-token text-xl line-through' : 'text-primary-token text-xl font-semibold'
          }
        >
          {todo.title}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-muted-token text-sm font-medium">Fällig</span>
          <input
            type="date"
            value={toDateInputValue(todo.dueDate)}
            onChange={(event) => {
              const nextValue = event.target.value
                ? new Date(`${event.target.value}T12:00:00`).toISOString()
                : undefined;
              onDueDateChange(todo.id, nextValue);
            }}
            className="touch-target min-w-[11.5rem] rounded-lg border border-slate-400/12 bg-white/[0.04] px-3 text-sm text-primary-token focus:outline-none focus:ring-2 focus:ring-blue-400/35"
          />
          {todo.dueDate ? (
            <button
              type="button"
              onClick={() => onDueDateChange(todo.id, undefined)}
              className="touch-target rounded-lg border border-slate-400/12 px-3 py-2 text-sm text-muted-token transition hover:bg-white/[0.04] hover:text-primary-token"
            >
              Entfernen
            </button>
          ) : null}
        </span>
      </span>
    </div>
  );
}

const STORAGE_KEY = 'organizer-todos';

export function TodosCard() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => toggleTodo(id, done),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const addMutation = useMutation({
    mutationFn: ({ title, dueDate }: { title: string; dueDate?: string }) => addTodo(title, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTitle('');
      setNewDueDate('');
      inputRef.current?.focus();
    },
  });

  const dueDateMutation = useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate?: string }) => updateTodoDueDate(id, dueDate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const todos = todosQuery.data ?? [];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);

    // Optimistic update: write new order to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reordered));
    queryClient.setQueryData<TodoItem[]>(['todos'], reordered);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    addMutation.mutate({
      title,
      dueDate: newDueDate ? new Date(`${newDueDate}T12:00:00`).toISOString() : undefined,
    });
  }

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(59,130,246,0.08),transparent)]" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="panel-title text-blue-300/55">To-dos</p>
          <span className="chip-accent rounded-full px-3 py-1 text-sm font-bold">
            {todos.filter((t) => !t.done).length} offen
          </span>
        </div>

        {/* Add-new form */}
        <form onSubmit={handleAdd} className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem_auto] sm:items-end">
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-muted-token text-xs font-semibold uppercase tracking-[0.18em]">Aufgabe</span>
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Neue Aufgabe…"
              className="h-14 min-w-0 rounded-xl border border-slate-400/12 bg-white/[0.04] px-5 text-xl text-primary-token placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400/35"
            />
          </label>
          <label className="grid gap-2 sm:col-span-1">
            <span className="text-muted-token text-xs font-semibold uppercase tracking-[0.18em]">Fällig</span>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="h-14 min-w-0 rounded-xl border border-slate-400/12 bg-white/[0.04] px-4 text-base text-primary-token focus:outline-none focus:ring-2 focus:ring-blue-400/35"
            />
          </label>
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/85 text-3xl font-bold text-white transition hover:bg-blue-500 disabled:opacity-30"
          >
            +
          </button>
        </form>

        {/* Sortable list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-5 space-y-2">
              {todos.map((todo) => (
                <SortableRow
                  key={todo.id}
                  todo={todo}
                  onToggle={(id, done) => toggleMutation.mutate({ id, done })}
                  onDueDateChange={(id, dueDate) => dueDateMutation.mutate({ id, dueDate })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}