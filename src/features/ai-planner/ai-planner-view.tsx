"use client";

import { Bot, Clock, Gauge, Sparkles, TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import {
  isHighPriority,
  isTaskOverdue,
  isTaskToday,
  sortTasksByUrgency,
} from "@/features/tasks/task-utils";
import { formatReadableDate, isDateToday } from "@/lib/date-utils";
import type { Task, TaskPriority } from "@/types/planning";

type PlannerRecommendation = {
  id: string;
  task: Task;
  score: number;
  title: string;
  detail: string;
  action: string;
  reasons: string[];
};

const priorityScore: Record<TaskPriority, number> = {
  critical: 40,
  high: 28,
  medium: 14,
  low: 5,
};

export function AiPlannerView() {
  const { tasks } = usePlanningStore();
  const openTasks = tasks.filter((task) => task.status !== "done");
  const todayTasks = openTasks.filter(isTaskToday);
  const overdueTasks = openTasks.filter(isTaskOverdue);
  const estimatedToday = todayTasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0,
  );
  const overloaded = todayTasks.length >= 5 || estimatedToday > 300;
  const recommendations = buildRecommendations(openTasks, overloaded);
  const quickWins = recommendations.filter(
    (item) => item.task.estimatedMinutes <= 30,
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Reglas locales
          </p>
          <h1 className="mt-2 text-3xl font-semibold">AI Planner</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Motor mock sin API real. Ordena recomendaciones por deadline,
            prioridad, tareas vencidas, tiempo estimado y carga del dia.
          </p>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge size={20} className="text-muted-foreground" />
            <h2 className="font-semibold">Carga de hoy</h2>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric label="Tareas" value={todayTasks.length} />
            <Metric label="Horas" value={Math.round(estimatedToday / 60)} />
            <Metric label="Vencidas" value={overdueTasks.length} danger />
          </div>
        </aside>
      </section>

      {overloaded ? (
        <section className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <TriangleAlert size={22} className="mt-0.5 shrink-0" />
          <div>
            <h2 className="font-semibold">Posible sobrecarga</h2>
            <p className="mt-1 text-sm leading-6">
              Tienes {todayTasks.length} tareas para hoy y{" "}
              {Math.round(estimatedToday / 60)}h estimadas. El plan recomienda
              empezar por vencidas/criticas y mover tareas largas si no son
              urgentes.
            </p>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-muted-foreground" />
              <h2 className="font-semibold">Recomendaciones priorizadas</h2>
            </div>
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              {recommendations.length}
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {recommendations.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="Sin recomendaciones urgentes"
                description="No hay tareas abiertas que requieran una decision inmediata."
              />
            ) : (
              recommendations.slice(0, 8).map((recommendation, index) => (
                <article
                  key={recommendation.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                          #{index + 1}
                        </span>
                        <PriorityBadge priority={recommendation.task.priority} />
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          <Clock size={13} aria-hidden="true" />
                          {recommendation.task.estimatedMinutes} min
                        </span>
                      </div>
                      <h3 className="mt-3 font-semibold">
                        {recommendation.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {recommendation.detail}
                      </p>
                    </div>
                    <div className="rounded-md border border-border px-3 py-2 text-center">
                      <p className="text-xs font-medium text-muted-foreground">
                        Score
                      </p>
                      <p className="text-lg font-semibold">
                        {recommendation.score}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-md bg-muted/60 p-3">
                    <p className="text-sm font-medium">{recommendation.action}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {recommendation.reasons.join(" · ")}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-muted-foreground" />
              <h2 className="font-semibold">Criterios del mock</h2>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <p>Vencidas suman mas peso que cualquier otra senal.</p>
              <p>Criticas y altas suben si ademas vencen hoy.</p>
              <p>Tareas cortas reciben un empujon si ayudan a liberar carga.</p>
              <p>Tareas largas bajan si el dia ya esta saturado.</p>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Quick wins</h2>
            <div className="mt-4 flex flex-col gap-2">
              {quickWins.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay tareas cortas abiertas.
                </p>
              ) : (
                quickWins.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="text-sm font-medium">{item.task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.task.estimatedMinutes} min · limite{" "}
                      {formatReadableDate(item.task.dueDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3 text-center">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${danger ? "text-destructive" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function buildRecommendations(tasks: Task[], overloaded: boolean) {
  return tasks
    .map((task): PlannerRecommendation => {
      const reasons: string[] = [];
      let score = priorityScore[task.priority];

      if (isTaskOverdue(task)) {
        score += 55;
        reasons.push("vencida");
      }

      if (isDateToday(task.dueDate)) {
        score += 35;
        reasons.push("deadline hoy");
      }

      if (isDateToday(task.plannedDate)) {
        score += 20;
        reasons.push("planeada hoy");
      }

      if (task.estimatedMinutes <= 30) {
        score += 8;
        reasons.push("corta");
      }

      if (task.estimatedMinutes >= 90 && overloaded) {
        score -= 10;
        reasons.push("larga en dia cargado");
      }

      if (isHighPriority(task)) {
        reasons.push("alta prioridad");
      }

      const title = buildTitle(task);

      return {
        id: task.id,
        task,
        score,
        title,
        detail: buildDetail(task),
        action: buildAction(task, overloaded),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score || sortTasksByUrgency([a.task, b.task]).indexOf(a.task));
}

function buildTitle(task: Task) {
  if (isTaskOverdue(task)) {
    return `Resolver vencida: ${task.title}`;
  }

  if (isDateToday(task.dueDate)) {
    return `Hacer hoy: ${task.title}`;
  }

  if (isHighPriority(task)) {
    return `Proteger prioridad: ${task.title}`;
  }

  return `Avanzar: ${task.title}`;
}

function buildDetail(task: Task) {
  return `Limite ${formatReadableDate(task.dueDate)}, plan ${formatReadableDate(
    task.plannedDate,
  )}, ${task.estimatedMinutes} min estimados.`;
}

function buildAction(task: Task, overloaded: boolean) {
  if (isTaskOverdue(task)) {
    return "Decision sugerida: completarla ahora o reprogramarla antes de abrir tareas nuevas.";
  }

  if (overloaded && task.estimatedMinutes >= 90) {
    return "Decision sugerida: dividirla en un bloque menor o moverla a otro dia.";
  }

  if (task.estimatedMinutes <= 30) {
    return "Decision sugerida: cerrarla temprano para liberar atencion.";
  }

  return "Decision sugerida: reservar un bloque claro y evitar multitarea.";
}
