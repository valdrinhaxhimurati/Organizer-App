import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '../components/NavBar';
import { ClockCard } from '../components/ClockCard';
import { ShoppingCard } from '../components/ShoppingCard';
import { TodayCard } from '../components/TodayCard';
import { TodosCard } from '../components/TodosCard';
import { WeatherCard } from '../components/WeatherCard';
import { WeekCard } from '../components/WeekCard';
import { dayBounds } from '../lib/utils';
import { getCalendarEvents } from '../services/calendar';

export function AppShell() {
  const calendarQuery = useQuery({
    queryKey: ['calendar'],
    queryFn: getCalendarEvents,
    // Re-fetch when the window regains focus (Outlook token might have been refreshed)
    refetchOnWindowFocus: true,
  });

  const todayEvents = useMemo(() => {
    const { start, end } = dayBounds(1);
    return (calendarQuery.data ?? []).filter((event) => {
      const starts = new Date(event.startsAt);
      return starts >= start && starts < end;
    });
  }, [calendarQuery.data]);

  const weekEvents = useMemo(() => {
    const { start, end } = dayBounds(7);
    return (calendarQuery.data ?? []).filter((event) => {
      const starts = new Date(event.startsAt);
      return starts >= start && starts < end;
    });
  }, [calendarQuery.data]);

  return (
    <main className="min-h-screen px-8 py-8 text-white xl:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px] flex-col gap-6">
        {/* Navigation */}
        <NavBar />

        {/* Top row: Clock + Weather */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ClockCard />
          <WeatherCard />
        </div>

        {/* Bottom rows: Calendar (left) | Todos + Shopping (right) */}
        <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <TodayCard todayEvents={todayEvents} />
            <WeekCard weekEvents={weekEvents} />
          </div>
          <div className="grid gap-6">
            <TodosCard />
            <ShoppingCard />
          </div>
        </div>
      </div>
    </main>
  );
}