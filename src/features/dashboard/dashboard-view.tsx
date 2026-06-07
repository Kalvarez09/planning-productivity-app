"use client";

import { BarChart3, CalendarDays, CheckCircle2, Flame, Target } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { PriorityBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import {
  isHighPriority,
  isTaskOverdue,
  isTaskToday,
  sortTasksByUrgency,
} from "@/features/tasks/task-utils";
import { formatLongDate, formatReadableDate } from "@/lib/date-utils";

export function DashboardView() {
  const { tasks, habits } = usePlanningStore();
  const todayTasks = sortTasksByUrgency(tasks.filter(isTaskToday));
  const highPriorityTasks = sortTasksByUrgency(
    tasks.filter((task) => isHighPriority(task) && task.status !== "done"),
  );
  const overdueTasks = sortTasksByUrgency(tasks.filter(isTaskOverdue));
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const completedHabitsToday = habits.filter((habit) =>
    habit.completedDates.includes(new Date().toISOString().slice(0, 10)),
  ).length;

  const metrics = [
    {
      label: "Tareas de hoy",
      value: todayTasks.length,
      detail: `${todayTasks.filter((task) => task.status !== "done").length} abiertas`,
      icon: CheckCircle2,
    },
    {
      label: "Alta prioridad",
      value: highPriorityTasks.length,
      detail: "Criticas y altas",
      icon: Target,
    },
    {
      label: "Vencidas",
      value: overdueTasks.length,
      detail: "Requieren decision",
      icon: CalendarDays,
    },
    {
      label: "Habitos hoy",
      value: `${completedHabitsToday}/${habits.length}`,
      detail: "Completados",
      icon: Flame,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium capitalize text-muted-foreground">
            {formatLongDate(new Date())}
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Planifica el dia con claridad.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Tu tablero lee las tareas guardadas localmente y resume foco,
            urgencia, progreso y habitos del dia.
          </p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium">Progreso general</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Siguiente foco</h2>
            <BarChart3 size={20} className="text-muted-foreground" />
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {todayTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap gap-2">
                  <TaskStatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
                <p className="mt-3 font-medium">{task.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {task.estimatedMinutes} min · limite{" "}
                  {formatReadableDate(task.dueDate)}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <Icon size={20} className="text-muted-foreground" />
              </div>
              <p className="mt-5 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <TaskList title="Hoy" tasks={todayTasks} />
        <TaskList title="Alta prioridad" tasks={highPriorityTasks} />
        <TaskList title="Vencidas" tasks={overdueTasks} />
      </section>
    </main>
  );
}

function TaskList({ title, tasks }: { title: string; tasks: ReturnType<typeof sortTasksByUrgency> }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin tareas en esta vista.</p>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="rounded-md border border-border p-3">
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {task.category} · {formatReadableDate(task.dueDate)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
