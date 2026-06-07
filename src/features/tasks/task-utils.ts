import { isDateOverdue, isDateToday } from "@/lib/date-utils";
import type { Task, TaskPriority, TaskStatus } from "@/types/planning";

export const taskPriorities: TaskPriority[] = [
  "critical",
  "high",
  "medium",
  "low",
];

export const taskStatuses: TaskStatus[] = ["todo", "in_progress", "done"];

export const taskCategories = [
  "Trabajo",
  "Productividad",
  "Salud",
  "Finanzas",
  "Aprendizaje",
  "Personal",
  "Relaciones",
] as const;

export function isTaskToday(task: Task) {
  return isDateToday(task.plannedDate) || isDateToday(task.dueDate);
}

export function isTaskOverdue(task: Task) {
  return task.status !== "done" && isDateOverdue(task.dueDate);
}

export function isHighPriority(task: Task) {
  return task.priority === "critical" || task.priority === "high";
}

export function sortTasksByUrgency(tasks: Task[]) {
  const priorityWeight: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") {
      return 1;
    }

    if (a.status !== "done" && b.status === "done") {
      return -1;
    }

    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}
