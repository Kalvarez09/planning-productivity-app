"use client";

import { CheckCircle2, RotateCcw, TriangleAlert } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { usePlanningStore } from "@/features/planning/planning-store";
import {
  isHighPriority,
  isTaskOverdue,
  isTaskToday,
} from "@/features/tasks/task-utils";

export function ReviewView() {
  const { tasks, habits } = usePlanningStore();
  const completed = tasks.filter((task) => task.status === "done");
  const overdue = tasks.filter(isTaskOverdue);
  const highOpen = tasks.filter(
    (task) => isHighPriority(task) && task.status !== "done",
  );
  const todayTasks = tasks.filter(isTaskToday);
  const progress =
    tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  const reviewItems = [
    {
      title: "Completadas",
      value: completed.length,
      detail: "Tareas cerradas en el sistema",
      icon: CheckCircle2,
    },
    {
      title: "Vencidas",
      value: overdue.length,
      detail: "Conviene reprogramar o eliminar",
      icon: TriangleAlert,
    },
    {
      title: "Prioridad abierta",
      value: highOpen.length,
      detail: "Criticas y altas pendientes",
      icon: RotateCcw,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Cierre y aprendizaje
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Revision</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Una lectura rapida para decidir que cerrar, mover o proteger en la
          siguiente semana.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reviewItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <Icon size={20} className="text-muted-foreground" />
              </div>
              <p className="mt-5 text-3xl font-semibold">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">Progreso de tareas</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <ProgressBar value={progress} />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Carga de hoy
              </p>
              <p className="mt-2 text-2xl font-semibold">{todayTasks.length}</p>
            </div>
            <div className="rounded-md border border-border p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Habitos activos
              </p>
              <p className="mt-2 text-2xl font-semibold">{habits.length}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Preguntas de revision</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <p>Que tarea ya no merece estar en la lista?</p>
            <p>Que bloque de foco necesita proteccion esta semana?</p>
            <p>Que habito tuvo mejor retorno por energia invertida?</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
