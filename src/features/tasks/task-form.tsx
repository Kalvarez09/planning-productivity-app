"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { mockProjects } from "@/features/planning/mock-data";
import { taskCategories, taskPriorities, taskStatuses } from "@/features/tasks/task-utils";
import { toDateInputValue } from "@/lib/date-utils";
import type { Task, TaskInput } from "@/types/planning";

const taskSchema = z.object({
  title: z.string().min(3, "Escribe al menos 3 caracteres."),
  description: z.string(),
  category: z.enum(taskCategories),
  priority: z.enum(taskPriorities),
  status: z.enum(taskStatuses),
  dueDate: z.string().min(1, "Elige una fecha limite."),
  plannedDate: z.string().min(1, "Elige una fecha planeada."),
  estimatedMinutes: z.coerce.number().min(5).max(1440),
  projectId: z.string().optional(),
});

type TaskFormInput = z.input<typeof taskSchema>;
type TaskFormValues = z.output<typeof taskSchema>;

type TaskFormProps = {
  task?: Task;
  onSubmit: (task: TaskInput) => void;
  onCancel: () => void;
};

const inputClass =
  "min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring";

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const today = toDateInputValue(new Date());
  const form = useForm<TaskFormInput, unknown, TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      category: task?.category ?? "Trabajo",
      priority: task?.priority ?? "medium",
      status: task?.status ?? "todo",
      dueDate: task?.dueDate ?? today,
      plannedDate: task?.plannedDate ?? today,
      estimatedMinutes: task?.estimatedMinutes ?? 30,
      projectId: task?.projectId ?? "",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        onSubmit({
          ...values,
          projectId: values.projectId || undefined,
        }),
      )}
      className="rounded-lg border border-border bg-card p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium">Titulo</span>
          <input className={inputClass} {...form.register("title")} />
          {form.formState.errors.title ? (
            <span className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium">Descripcion</span>
          <textarea
            className={`${inputClass} min-h-24 resize-none`}
            {...form.register("description")}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Categoria</span>
          <select className={inputClass} {...form.register("category")}>
            {taskCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Proyecto</span>
          <select className={inputClass} {...form.register("projectId")}>
            <option value="">Sin proyecto</option>
            {mockProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Prioridad</span>
          <select className={inputClass} {...form.register("priority")}>
            <option value="critical">Critica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Estado</span>
          <select className={inputClass} {...form.register("status")}>
            <option value="todo">Pendiente</option>
            <option value="in_progress">En curso</option>
            <option value="done">Completada</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Fecha limite</span>
          <input type="date" className={inputClass} {...form.register("dueDate")} />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Fecha planeada</span>
          <input
            type="date"
            className={inputClass}
            {...form.register("plannedDate")}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tiempo estimado</span>
          <input
            type="number"
            min={5}
            step={5}
            className={inputClass}
            {...form.register("estimatedMinutes")}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          {task ? "Guardar cambios" : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}
