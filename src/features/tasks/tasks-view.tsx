"use client";

import { Clock, Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { PriorityBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import { TaskForm } from "@/features/tasks/task-form";
import {
  isTaskOverdue,
  sortTasksByUrgency,
  taskPriorities,
  taskStatuses,
} from "@/features/tasks/task-utils";
import { formatReadableDate } from "@/lib/date-utils";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/types/planning";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

export function TasksView() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted } =
    usePlanningStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const filteredTasks = useMemo(() => {
    return sortTasksByUrgency(tasks).filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesStatus && matchesPriority;
    });
  }, [priorityFilter, statusFilter, tasks]);

  function closeForm() {
    setShowForm(false);
    setEditingTask(undefined);
  }

  function handleSubmit(task: TaskInput) {
    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }

    closeForm();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Inbox operativo
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Tareas</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Crea, edita, filtra y completa tareas. Todo queda guardado
            temporalmente en localStorage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTask(undefined);
            setShowForm((current) => !current);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus size={18} aria-hidden="true" />
          Nueva tarea
        </button>
      </section>

      {showForm || editingTask ? (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
      ) : null}

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm md:flex-row md:items-center">
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
          Estado
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="all">Todos</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "todo"
                  ? "Pendiente"
                  : status === "in_progress"
                    ? "En curso"
                    : "Completada"}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-2 text-sm font-medium">
          Prioridad
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as PriorityFilter)
            }
            className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="all">Todas</option>
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "critical"
                  ? "Critica"
                  : priority === "high"
                    ? "Alta"
                    : priority === "medium"
                      ? "Media"
                      : "Baja"}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="grid gap-4">
        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  {isTaskOverdue(task) ? (
                    <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      Vencida
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold">{task.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {task.description || "Sin descripcion."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{task.category}</span>
                  <span>Limite: {formatReadableDate(task.dueDate)}</span>
                  <span>Plan: {formatReadableDate(task.plannedDate)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={15} aria-hidden="true" />
                    {task.estimatedMinutes} min
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {task.status === "done" ? "Reabrir" : "Completar"}
                </button>
                <button
                  type="button"
                  aria-label="Editar tarea"
                  title="Editar tarea"
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(false);
                  }}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
                >
                  <Edit3 size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar tarea"
                  title="Eliminar tarea"
                  onClick={() => {
                    if (window.confirm("Eliminar esta tarea?")) {
                      deleteTask(task.id);
                    }
                  }}
                  className="inline-flex size-10 items-center justify-center rounded-md border border-border text-destructive transition-colors hover:bg-muted"
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
