"use client";

import { Bot, Sparkles, TriangleAlert } from "lucide-react";

import { PriorityBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import {
  isHighPriority,
  isTaskToday,
  sortTasksByUrgency,
} from "@/features/tasks/task-utils";

export function AiPlannerView() {
  const { tasks } = usePlanningStore();
  const openTasks = tasks.filter((task) => task.status !== "done");
  const todayTasks = openTasks.filter(isTaskToday);
  const priorityTasks = sortTasksByUrgency(openTasks.filter(isHighPriority));
  const estimatedToday = todayTasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0,
  );
  const overloaded = todayTasks.length >= 5 || estimatedToday > 300;

  const recommendations = [
    ...sortTasksByUrgency(todayTasks).map((task) => ({
      id: `today-${task.id}`,
      title: `Haz primero: ${task.title}`,
      detail: "Vence o esta planeada para hoy.",
      task,
    })),
    ...priorityTasks
      .filter((task) => !todayTasks.some((todayTask) => todayTask.id === task.id))
      .slice(0, 3)
      .map((task) => ({
        id: `priority-${task.id}`,
        title: `Sube prioridad: ${task.title}`,
        detail: "Tiene prioridad critica o alta.",
        task,
      })),
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Reglas locales
        </p>
        <h1 className="mt-2 text-3xl font-semibold">AI Planner</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Mock sin API real: prioriza tareas de hoy, prioridad alta y alerta si
          el dia esta sobrecargado.
        </p>
      </section>

      {overloaded ? (
        <section className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <TriangleAlert size={22} className="mt-0.5 shrink-0" />
          <div>
            <h2 className="font-semibold">Posible sobrecarga</h2>
            <p className="mt-1 text-sm leading-6">
              Tienes {todayTasks.length} tareas para hoy y{" "}
              {Math.round(estimatedToday / 60)}h estimadas. Considera mover o
              eliminar algo antes de empezar.
            </p>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recomendaciones</h2>
            <Sparkles size={20} className="text-muted-foreground" />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay recomendaciones urgentes con las reglas actuales.
              </p>
            ) : (
              recommendations.slice(0, 8).map((recommendation) => (
                <article
                  key={recommendation.id}
                  className="rounded-md border border-border p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={recommendation.task.priority} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {recommendation.task.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{recommendation.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {recommendation.detail}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-muted-foreground" />
            <h2 className="font-semibold">Motor mock</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <p>1. Tareas que vencen hoy suben al inicio.</p>
            <p>2. Criticas y altas se ordenan antes que el resto.</p>
            <p>3. Mas de 5 tareas o 5 horas estimadas dispara alerta.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
