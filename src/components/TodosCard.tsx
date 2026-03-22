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
import { addTodo, getTodos, toggleTodo } from '../services/todos';

function SortableRow({
  todo,
  onToggle,
}: {
  todo: TodoItem;
  onToggle: (id: string, done: boolean) => void;
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
      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.04] px-4 py-3.5"
    >
      {/* drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-zinc-600 hover:text-zinc-400 active:cursor-grabbing"
        aria-label="Ziehen zum Sortieren"
      >
        ⠿
      </button>

      {/* checkbox */}
      <button
        type="button"
        onClick={() => onToggle(todo.id, !todo.done)}
        className={[
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm transition',
          todo.done
            ? 'border-violet-400/50 bg-violet-400/15 text-violet-200'
            : 'border-white/20 text-white/20 hover:border-white/50',
        ].join(' ')}
      >
        {todo.done ? '✓' : ''}
      </button>

      {/* title */}
      <span className="flex-1 text-left">
        <span
          className={
            todo.done ? 'text-xl text-white/30 line-through' : 'text-xl font-semibold text-white'
          }
        >
          {todo.title}
        </span>
        {todo.dueDate ? (
          <span className="mt-1 block text-lg text-zinc-400">
            Fällig: {new Date(todo.dueDate).toLocaleDateString('de-CH')}
          </span>
        ) : null}
      </span>
    </div>
  );
}

const STORAGE_KEY = 'organizer-todos';

export function TodosCard() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
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
    mutationFn: (title: string) => addTodo(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTitle('');
      inputRef.current?.focus();
    },
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
    addMutation.mutate(title);
  }

  return (
    <section className="panel p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(139,92,246,0.10),transparent)]" />
      <div className="relative">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title text-violet-400/60">To-dos</p>
        <span className="rounded-full bg-violet-400/10 px-3 py-1 text-sm font-bold text-violet-300/80">
          {todos.filter((t) => !t.done).length} offen
        </span>
      </div>

      {/* Add-new form */}
      <form onSubmit={handleAdd} className="mt-5 flex gap-3">
        <input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Neue Aufgabe…"
          className="h-14 flex-1 min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.05] px-5 text-xl text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-400/35"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/80 text-3xl font-bold text-white transition hover:bg-violet-500/90 disabled:opacity-30"
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      </div>
    </section>
  );
}