export type TaskPriority = "low" | "medium" | "high" | "critical";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskCategory =
  | "Trabajo"
  | "Productividad"
  | "Salud"
  | "Finanzas"
  | "Aprendizaje"
  | "Personal"
  | "Relaciones";

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  plannedDate: string;
  estimatedMinutes: number;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  area: string;
  color: string;
  taskIds: string[];
};

export type Habit = {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  cadence: "daily" | "weekly";
  targetPerWeek: number;
  completedDates: string[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  area: string;
  current: number;
  target: number;
  unit: string;
  dueDate: string;
};

export type TaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;
