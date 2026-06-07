"use client";

import { Clock, Flame } from "lucide-react";

import { PriorityBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import { isTaskToday, sortTasksByUrgency } from "@/features/tasks/task-utils";
import { toDateInputValue } from "@/lib/date-utils";

export function TodayView() {
  const { tasks, habits, toggleTaskCompleted, toggleHabitToday } = usePlanningStore();
  const today = toDateInputValue(new Date());
  const todayTasks = sortTasksByUrgency(tasks.filter(isTaskToday));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">Vista diaria</p>
        <h1 className="mt-2 text-3xl font-semibold">Hoy</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Un resumen accionable de tareas planeadas, vencimientos y habitos para
          cerrar el dia con foco.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Tareas de hoy</h2>
          <div className="mt-4 flex flex-col gap-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-md border border-border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    <TaskStatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="mt-3 font-medium">{task.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={15} aria-hidden="true" />
                    {task.estimatedMinutes} min
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {task.status === "done" ? "Reabrir" : "Completar"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Habitos</h2>
            <Flame size={20} className="text-muted-foreground" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {habits.map((habit) => {
              const completed = habit.completedDates.includes(today);

              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleHabitToday(habit.id)}
                  className="rounded-md border border-border p-4 text-left transition-colors hover:bg-muted"
                >
                  <p className="font-medium">{habit.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {completed ? "Completado hoy" : "Pendiente hoy"}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>
      </section>
    </main>
  );
}
