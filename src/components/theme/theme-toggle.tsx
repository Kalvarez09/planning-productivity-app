"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const themeOptions = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

function subscribe() {
  return () => undefined;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div className="flex rounded-md border border-border bg-card p-1">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = mounted && theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={`Tema ${option.label.toLowerCase()}`}
            title={`Tema ${option.label.toLowerCase()}`}
            onClick={() => setTheme(option.value)}
            className={`inline-flex size-9 items-center justify-center rounded-sm transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
