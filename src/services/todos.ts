import type { TodoItem } from '../lib/types';
import { supabase } from './supabase';

const FALLBACK_KEY = 'organizer-local-todos';

const fallbackTodos: TodoItem[] = [
  {
    id: 'local-1',
    title: 'Milch und Brot besorgen',
    done: false,
    dueDate: new Date().toISOString()
  },
  {
    id: 'local-2',
    title: 'Hausaufgabenmappe kontrollieren',
    done: false,
    dueDate: new Date().toISOString()
  },
  {
    id: 'local-3',
    title: 'Pfand mitnehmen',
    done: true
  }
];

function readFallback(): TodoItem[] {
  const raw = localStorage.getItem(FALLBACK_KEY);
  if (!raw) {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(fallbackTodos));
    return fallbackTodos;
  }
  return JSON.parse(raw) as TodoItem[];
}

function writeFallback(todos: TodoItem[]) {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(todos));
}

export async function getTodos(): Promise<TodoItem[]> {
  if (!supabase) {
    return readFallback();
  }

  const { data, error } = await supabase.from('todos').select('id,title,notes,done,due_date').order('done');
  if (error) {
    return readFallback();
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    notes: item.notes ?? undefined,
    done: item.done,
    dueDate: item.due_date ?? undefined
  }));
}

export async function toggleTodo(id: string, done: boolean) {
  if (!supabase) {
    const todos = readFallback().map((item) => (item.id === id ? { ...item, done } : item));
    writeFallback(todos);
    return;
  }

  const { error } = await supabase.from('todos').update({ done }).eq('id', id);
  if (error) {
    throw error;
  }
}