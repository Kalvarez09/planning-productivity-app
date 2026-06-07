"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { toDateInputValue } from "@/lib/date-utils";
import { mockHabits, mockTasks } from "@/features/planning/mock-data";
import type { Habit, Task, TaskInput } from "@/types/planning";

type PlanningState = {
  tasks: Task[];
  habits: Habit[];
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, task: TaskInput) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleHabitToday: (id: string) => void;
  resetMockData: () => void;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      habits: mockHabits,
      addTask: (task) =>
        set((state) => {
          const timestamp = new Date().toISOString();

          return {
            tasks: [
              {
                ...task,
                id: createId("task"),
                createdAt: timestamp,
                updatedAt: timestamp,
              },
              ...state.tasks,
            ],
          };
        }),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === id
              ? { ...item, ...task, updatedAt: new Date().toISOString() }
              : item,
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleTaskCompleted: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: task.status === "done" ? "todo" : "done",
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        })),
      toggleHabitToday: (id) =>
        set((state) => {
          const today = toDateInputValue(new Date());

          return {
            habits: state.habits.map((habit) => {
              if (habit.id !== id) {
                return habit;
              }

              const hasCompletedToday = habit.completedDates.includes(today);

              return {
                ...habit,
                completedDates: hasCompletedToday
                  ? habit.completedDates.filter((date) => date !== today)
                  : [...habit.completedDates, today],
              };
            }),
          };
        }),
      resetMockData: () => set({ tasks: mockTasks, habits: mockHabits }),
    }),
    {
      name: "planning-mvp-storage",
      version: 1,
    },
  ),
);
