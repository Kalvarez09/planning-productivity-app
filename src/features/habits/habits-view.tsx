"use client";

import { CheckCircle2, Flame } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { usePlanningStore } from "@/features/planning/planning-store";
import { isDateInCurrentWeek, toDateInputValue } from "@/lib/date-utils";

export function HabitsView() {
  const { habits, toggleHabitToday } = usePlanningStore();
  const today = toDateInputValue(new Date());

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Rutinas clave
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Habitos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Marca habitos como completados hoy. El estado queda persistido en
          localStorage.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {habits.map((habit) => {
          const completedToday = habit.completedDates.includes(today);
          const weeklyCount = habit.completedDates.filter(isDateInCurrentWeek).length;
          const progress = Math.round((weeklyCount / habit.targetPerWeek) * 100);

          return (
            <article
              key={habit.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {habit.category}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{habit.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {habit.description}
                  </p>
                </div>
                <Flame size={20} className="text-muted-foreground" />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">Semana</span>
                  <span className="text-muted-foreground">
                    {weeklyCount}/{habit.targetPerWeek}
                  </span>
                </div>
                <ProgressBar value={progress} />
              </div>

              <button
                type="button"
                onClick={() => toggleHabitToday(habit.id)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <CheckCircle2
                  size={18}
                  className={
                    completedToday
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }
                />
                {completedToday ? "Completado hoy" : "Marcar hoy"}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
