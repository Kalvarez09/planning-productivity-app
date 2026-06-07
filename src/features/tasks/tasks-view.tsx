"use client";

import { AlertTriangle, Clock, Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import {
  PriorityBadge,
  statusLabel,
  TaskStatusBadge,
} from "@/components/ui/status-badge";
import { usePlanningStore } from "@/features/planning/planning-store";
import { TaskForm } from "@/features/tasks/task-form";
import {
  isTaskOverdue,
  sortTasksByUrgency,
  taskPriorities,
  taskStatuses,
} from "@/features/tasks/task-utils";
import { formatReadableDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "@/types/planning";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;

const sectionOrder: TaskStatus[] = ["todo", "in_progress", "done"];

export function TasksView() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted } =
    usePlanningStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [query, setQuery] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortTasksByUrgency(tasks).filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesOverdue = !overdueOnly || isTaskOverdue(task);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [task.title, task.description, task.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesPriority && matchesOverdue && matchesQuery;
    });
  }, [overdueOnly, priorityFilter, query, statusFilter, tasks]);

  const groupedTasks = useMemo(() => {
    return sectionOrder.map((status) => ({
      status,
      tasks: filteredTasks.filter((task) => task.status === status),
    }));
  }, [filteredTasks]);

  const overdueCount = tasks.filter(isTaskOverdue).length;
  const hasFilters =
    query || statusFilter !== "all" || priorityFilter !== "all" || overdueOnly;

  function closeForm() {
    setShowForm(false);
    setEditingTask(undefined);
  }

  function openCreateForm() {
    setEditingTask(undefined);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(task: TaskInput) {
    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }

    closeForm();
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setOverdueOnly(false);
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
            Busca, filtra y organiza tareas por estado. Los cambios siguen
            guardandose en localStorage.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="hidden min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 sm:inline-flex"
        >
          <Plus size={18} aria-hidden="true" />
          Nueva tarea
        </button>
      </section>

      {overdueCount > 0 ? (
        <section className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-destructive shadow-sm">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              {overdueCount} tarea{overdueCount === 1 ? "" : "s"} vencida
              {overdueCount === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Reprograma, completa o elimina estos pendientes para reducir ruido.
            </p>
          </div>
        </section>
      ) : null}

      {showForm || editingTask ? (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
      ) : null}

      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Buscar
            <div className="flex min-h-11 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-ring">
              <Search size={17} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Titulo, descripcion o categoria"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Estado
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            >
              <option value="all">Todos</option>
              {taskStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Prioridad
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as PriorityFilter)
              }
              className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOverdueOnly((current) => !current)}
              className={cn(
                "min-h-11 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                overdueOnly && "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              Vencidas
            </button>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Limpiar
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No hay tareas con estos filtros"
            description="Prueba con otra busqueda o limpia los filtros para volver al listado completo."
          />
        ) : (
          groupedTasks.map(({ status, tasks: statusTasks }) => (
            <TaskSection
              key={status}
              title={statusLabel[status]}
              tasks={statusTasks}
              onToggle={toggleTaskCompleted}
              onEdit={(task) => {
                setEditingTask(task);
                setShowForm(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={deleteTask}
            />
          ))
        )}
      </section>

      <button
        type="button"
        aria-label="Crear tarea"
        title="Crear tarea"
        onClick={openCreateForm}
        className="fixed bottom-24 right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 sm:hidden"
      >
        <Plus size={24} aria-hidden="true" />
      </button>
    </main>
  );
}

function TaskSection({
  title,
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 px-1">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            Sin tareas en este estado.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const overdue = isTaskOverdue(task);

  return (
    <article
      className={cn(
        "rounded-lg border bg-background p-4 transition-colors hover:bg-muted/35",
        overdue ? "border-destructive/30 bg-destructive/5" : "border-border",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {overdue ? (
              <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                Vencida
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold">{task.title}</h3>
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
            onClick={() => onToggle(task.id)}
            className="min-h-10 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {task.status === "done" ? "Reabrir" : "Completar"}
          </button>
          <button
            type="button"
            aria-label="Editar tarea"
            title="Editar tarea"
            onClick={() => onEdit(task)}
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
                onDelete(task.id);
              }
            }}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-destructive transition-colors hover:bg-muted"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
