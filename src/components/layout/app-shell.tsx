"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CalendarDays,
  CheckSquare,
  Goal,
  Home,
  ListTodo,
  PanelLeft,
  Repeat,
  RotateCcw,
  Settings,
  Sparkles,
  SunMedium,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Hoy", href: "/today", icon: SunMedium },
  { label: "Tareas", href: "/tasks", icon: CheckSquare },
  { label: "Proyectos", href: "/projects", icon: ListTodo },
  { label: "Calendario", href: "/calendar", icon: CalendarDays },
  { label: "Objetivos", href: "/goals", icon: Goal },
  { label: "Habitos", href: "/habits", icon: Repeat },
  { label: "Revision", href: "/review", icon: RotateCcw },
  { label: "AI Planner", href: "/ai-planner", icon: Bot },
  { label: "Configuracion", href: "/settings", icon: Settings },
];

const mobileNavigation = navigation.slice(0, 5);

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const currentSection =
    navigation.find((item) => isActivePath(pathname, item.href)) ??
    navigation[0];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Life OS
              </p>
              <p className="font-semibold">Planificacion</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground lg:hidden">
              <PanelLeft size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-muted-foreground">
                Espacio personal
              </p>
              <p className="truncate font-semibold">{currentSection.label}</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 pb-20 lg:pb-0">{children}</div>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground",
                  active && "bg-primary text-primary-foreground",
                )}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
