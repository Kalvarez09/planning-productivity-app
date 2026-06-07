"use client";

import { CheckCircle2, ListTodo } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { mockProjects } from "@/features/planning/mock-data";
import { usePlanningStore } from "@/features/planning/planning-store";
import { cn } from "@/lib/utils";

export function ProjectsView() {
  const { tasks } = usePlanningStore();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Portafolio personal
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Proyectos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Vista visual de proyectos mock conectados a tareas locales.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {mockProjects.map((project) => {
          const projectTasks = tasks.filter((task) => task.projectId === project.id);
          const completed = projectTasks.filter((task) => task.status === "done").length;
          const progress =
            projectTasks.length > 0
              ? Math.round((completed / projectTasks.length) * 100)
              : 0;

          return (
            <article
              key={project.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={cn("mb-4 h-2 w-16 rounded-full", project.color)} />
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <ListTodo size={20} className="text-muted-foreground" />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">Progreso</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <ProgressBar value={progress} />
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {projectTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <CheckCircle2
                      size={16}
                      className={
                        task.status === "done"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }
                    />
                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
