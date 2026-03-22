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
      className="flex w-full items-center gap-4 rounded-3xl border border-white/8 bg-white/5 px-5 py-4"
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
            ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
            : 'border-zinc-500 text-zinc-500 hover:border-zinc-300',
        ].join(' ')}
      >
        {todo.done ? '✓' : ''}
      </button>

      {/* title */}
      <span className="flex-1 text-left">
        <span
          className={
            todo.done ? 'text-xl text-zinc-500 line-through' : 'text-2xl text-white'
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
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">To-dos</p>
        <span className="rounded-full bg-fuchsia-400/10 px-4 py-2 text-lg text-fuchsia-200">
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
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-fuchsia-400/50"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="rounded-2xl bg-fuchsia-500/80 px-5 py-3 text-2xl font-bold text-white transition hover:bg-fuchsia-500 disabled:opacity-30"
        >
          +
        </button>
      </form>

      {/* Sortable list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-5 space-y-3">
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
    </section>
  );
}