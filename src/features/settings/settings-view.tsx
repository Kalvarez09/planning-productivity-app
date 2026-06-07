"use client";

import { Database, RotateCcw, Settings } from "lucide-react";

import { usePlanningStore } from "@/features/planning/planning-store";

export function SettingsView() {
  const { resetMockData } = usePlanningStore();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-medium text-muted-foreground">
          Preferencias locales
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Configuracion</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Ajustes temporales para esta fase del MVP. Aun no hay base de datos,
          autenticacion ni integraciones.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-muted-foreground" />
            <h2 className="font-semibold">Persistencia temporal</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Las tareas y habitos se guardan en localStorage con la clave
            `planning-mvp-storage`.
          </p>
        </article>

        <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-muted-foreground" />
            <h2 className="font-semibold">Datos mock</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Puedes restaurar tareas y habitos iniciales para probar el flujo
            desde cero.
          </p>
          <button
            type="button"
            onClick={() => resetMockData()}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Restaurar mocks
          </button>
        </article>
      </section>
    </main>
  );
}
