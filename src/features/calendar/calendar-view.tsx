"use client";

import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import { PriorityBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import { isSameDate, toDateInputValue } from "@/lib/date-utils";

export function CalendarView() {
  const { tasks } = usePlanningStore();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Plan semanal
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Calendario</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Distribucion semanal basada en la fecha planeada de cada tarea.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        {weekDays.map((day) => {
          const dayValue = toDateInputValue(day);
          const dayTasks = tasks.filter((task) => isSameDate(task.plannedDate, dayValue));
          const estimatedMinutes = dayTasks.reduce(
            (total, task) => total + task.estimatedMinutes,
            0,
          );

          return (
            <article
              key={dayValue}
              className="min-h-56 rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {format(day, "EEE", { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(day, "d MMM", { locale: es })}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {Math.round(estimatedMinutes / 60)}h
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {dayTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin bloques.</p>
                ) : (
                  dayTasks.map((task) => (
                    <div key={task.id} className="rounded-md border border-border p-3">
                      <PriorityBadge priority={task.priority} />
                      <p className="mt-2 text-sm font-medium">{task.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {task.estimatedMinutes} min
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
