import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTodos, toggleTodo } from '../services/todos';

export function TodosCard() {
  const queryClient = useQueryClient();
  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  });

  const mutation = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => toggleTodo(id, done),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });

  return (
    <section className="panel p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="panel-title">To-dos</p>
        <span className="rounded-full bg-fuchsia-400/10 px-4 py-2 text-lg text-fuchsia-200">
          {todosQuery.data?.filter((item) => !item.done).length ?? 0} offen
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {todosQuery.data?.map((todo) => (
          <button
            key={todo.id}
            type="button"
            onClick={() => mutation.mutate({ id: todo.id, done: !todo.done })}
            className="flex w-full items-center gap-4 rounded-3xl border border-white/8 bg-white/5 px-5 py-4 text-left transition hover:bg-white/8"
          >
            <span
              className={[
                'flex h-8 w-8 items-center justify-center rounded-full border text-sm',
                todo.done
                  ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                  : 'border-zinc-500 text-zinc-500'
              ].join(' ')}
            >
              {todo.done ? '✓' : ''}
            </span>
            <span className="flex-1">
              <span className={todo.done ? 'text-xl text-zinc-500 line-through' : 'text-2xl text-white'}>{todo.title}</span>
              {todo.dueDate ? (
                <span className="mt-1 block text-lg text-zinc-400">
                  Fällig: {new Date(todo.dueDate).toLocaleDateString('de-CH')}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}