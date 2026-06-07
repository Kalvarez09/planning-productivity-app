# App Planificacion & Productividad

Base inicial de una app web moderna para planificacion personal, productividad y gestion de vida.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- ESLint
- shadcn/ui preparado mediante `components.json`
- lucide-react
- date-fns
- zod
- react-hook-form
- zustand
- dnd-kit
- recharts

## Requisitos

- Node.js 20 o superior recomendado.
- npm incluido con Node.js.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Estructura inicial

```text
src/
  app/
  components/
    layout/
    providers/
    theme/
    ui/
  config/
  features/
    areas/
    calendar/
    goals/
    habits/
    projects/
    reviews/
    tasks/
  hooks/
  lib/
```

## Notas

Esta fase no incluye base de datos, autenticacion, integraciones externas ni IA real.
