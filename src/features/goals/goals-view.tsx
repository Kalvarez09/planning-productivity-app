"use client";

import { Target } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { mockGoals } from "@/features/planning/mock-data";
import { formatReadableDate } from "@/lib/date-utils";

export function GoalsView() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Metas semanales
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Objetivos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Objetivos mock para orientar la semana y medir avance.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {mockGoals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);

          return (
            <article
              key={goal.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {goal.area}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{goal.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {goal.description}
                  </p>
                </div>
                <Target size={20} className="text-muted-foreground" />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <ProgressBar value={progress} />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Limite: {formatReadableDate(goal.dueDate)}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
