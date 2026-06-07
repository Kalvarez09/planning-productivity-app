"use client";

import { AlertTriangle, CalendarCheck2, CheckCircle2, Clock, Flame, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import {
  isHighPriority,
  isTaskOverdue,
  isTaskToday,
  sortTasksByUrgency,
} from "@/features/tasks/task-utils";
import { formatReadableDate, isDateToday, toDateInputValue } from "@/lib/date-utils";
import type { Task } from "@/types/planning";

export function TodayView() {
  const { tasks, habits, toggleTaskCompleted, toggleHabitToday } =
    usePlanningStore();
  const today = toDateInputValue(new Date());
  const openTasks = tasks.filter((task) => task.status !== "done");
  const overdueTasks = sortTasksByUrgency(tasks.filter(isTaskOverdue));
  const plannedTodayTasks = sortTasksByUrgency(
    tasks.filter((task) => isDateToday(task.plannedDate)),
  );
  const todayTasks = sortTasksByUrgency(tasks.filter(isTaskToday));
  const dayPriority =
    todayTasks.find((task) => task.status !== "done" && isHighPriority(task)) ??
    todayTasks.find((task) => task.status !== "done") ??
    sortTasksByUrgency(openTasks)[0];
  const pendingHabits = habits.filter(
    (habit) => !habit.completedDates.includes(today),
  );
  const estimatedToday = plannedTodayTasks
    .filter((task) => task.status !== "done")
    .reduce((total, task) => total + task.estimatedMinutes, 0);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Vista diaria
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Hoy</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Un tablero accionable para decidir el siguiente paso sin revisar
            toda la app.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Planeadas" value={plannedTodayTasks.length} />
            <Metric label="Vencidas" value={overdueTasks.length} tone="danger" />
            <Metric
              label="Carga"
              value={`${Math.round(estimatedToday / 60)}h`}
              detail={`${estimatedToday} min`}
            />
          </div>
        </div>

        <aside className="rounded-lg border border-primary/25 bg-primary/10 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={20} aria-hidden="true" />
            <h2 className="font-semibold">Que hacer ahora</h2>
          </div>
          {dayPriority ? (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge status={dayPriority.status} />
                <PriorityBadge priority={dayPriority.priority} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{dayPriority.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {buildNowReason(dayPriority)}
              </p>
              <button
                type="button"
                onClick={() => toggleTaskCompleted(dayPriority.id)}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <CheckCircle2 size={18} aria-hidden="true" />
                {dayPriority.status === "done" ? "Reabrir tarea" : "Marcar completada"}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No hay tareas abiertas. Buen momento para revisar objetivos o
              planear manana.
            </p>
          )}
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_360px]">
        <TaskPanel
          title="Planeadas para hoy"
          icon={CalendarCheck2}
          tasks={plannedTodayTasks}
          emptyTitle="Nada planeado para hoy"
          emptyDescription="Crea o reprograma tareas con fecha planeada de hoy para construir tu plan."
          onToggle={toggleTaskCompleted}
        />
        <TaskPanel
          title="Vencidas"
          icon={AlertTriangle}
          tasks={overdueTasks}
          emptyTitle="Sin tareas vencidas"
          emptyDescription="La lista esta limpia. Mantenerla asi reduce ruido mental."
          onToggle={toggleTaskCompleted}
          danger
        />

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Habitos pendientes</h2>
            <Flame size={20} className="text-muted-foreground" />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {pendingHabits.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Habitos al dia"
                description="No quedan habitos pendientes para hoy."
              />
            ) : (
              pendingHabits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleHabitToday(habit.id)}
                  className="min-h-16 rounded-md border border-border p-4 text-left transition-colors hover:bg-muted"
                >
                  <p className="font-medium">{habit.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {habit.category} · marcar completado
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "danger";
}) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${
          tone === "danger" ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

function TaskPanel({
  title,
  icon: Icon,
  tasks,
  emptyTitle,
  emptyDescription,
  onToggle,
  danger,
}: {
  title: string;
  icon: typeof CalendarCheck2;
  tasks: Task[];
  emptyTitle: string;
  emptyDescription: string;
  onToggle: (id: string) => void;
  danger?: boolean;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            size={20}
            className={danger ? "text-destructive" : "text-muted-foreground"}
          />
          <h2 className="font-semibold">{title}</h2>
        </div>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <EmptyState
            icon={Icon}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          tasks.map((task) => (
            <article
              key={task.id}
              className={`rounded-md border p-4 ${
                danger
                  ? "border-destructive/25 bg-destructive/5"
                  : "border-border"
              }`}
            >
              <div className="flex flex-wrap gap-2">
                <TaskStatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <h3 className="mt-3 font-medium">{task.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={15} aria-hidden="true" />
                {task.estimatedMinutes} min · limite{" "}
                {formatReadableDate(task.dueDate)}
              </p>
              <button
                type="button"
                onClick={() => onToggle(task.id)}
                className="mt-4 min-h-10 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {task.status === "done" ? "Reabrir" : "Completar"}
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function buildNowReason(task: Task) {
  if (isTaskOverdue(task)) {
    return "Esta tarea esta vencida. Decide si completarla, reprogramarla o eliminarla antes de seguir.";
  }

  if (isDateToday(task.dueDate)) {
    return "Vence hoy y tiene impacto directo en tu cierre del dia.";
  }

  if (isHighPriority(task)) {
    return "Es una tarea de alta prioridad. Conviene hacerla antes de abrir trabajo nuevo.";
  }

  return "Es el siguiente bloque razonable segun tu plan de hoy.";
}
