# Interphase Engineers - Project Control & Margin Tracking Dashboard

## Overview

A full-stack SaaS dashboard for Interphase Engineers (electrical contracting company) for project control, BOQ estimation, weekly consumption tracking, and margin analysis.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Routing**: Wouter
- **State**: React Query + custom AppState context

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   └── interphase-dashboard/ # React + Vite frontend (port 23065)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (seed data)
```

## Database Schema

### Tables
- `projects` — project metadata (name, client, type, location, value, dates, area, engineer, status)
- `estimates` — BOQ estimate rows (category, item, spec, unit, qty, rate, computed cost)
- `consumption` — weekly consumption entries (week#, dates, item, est/actual qty, unit cost)

### Enums
- `project_type`: electrical, civil, mechanical, plumbing, hvac, other
- `project_status`: planning, active, on_hold, completed, cancelled

## API Routes

All routes are under `/api/`:

- `GET /api/healthz` — health check
- `GET/POST /api/projects` — list/create projects
- `GET/PUT/DELETE /api/projects/:id` — get/update/delete project
- `GET /api/projects/:id/summary` — financial summary (computed from estimates + consumption)
- `GET/POST /api/estimates` — list/create estimate rows (requires `?projectId=`)
- `PUT/DELETE /api/estimates/:id` — update/delete estimate row
- `GET/POST /api/consumption` — list/create consumption entries (requires `?projectId=`)
- `PUT/DELETE /api/consumption/:id` — update/delete consumption entry
- `GET /api/reports/margin` — margin analysis report (requires `?projectId=`)
- `GET /api/reports/weekly-trend` — weekly cost trend (requires `?projectId=`)
- `GET /api/reports/category-breakdown` — cost by category (requires `?projectId=`)
- `GET /api/reports/dashboard-summary` — overview stats across all projects

## Frontend Pages

1. **Dashboard** (`/`) — KPI cards (active projects, revenue, margin, at-risk), recent projects table, quick actions
2. **Projects** (`/projects`) — Project setup form + directory table with Edit/Delete/Archive row actions
3. **Estimates** (`/estimates`) — BOQ-style editable spreadsheet table with auto-calculated cost column
4. **Weekly Consumption** (`/consumption`) — Weekly tracking table with variance color-coding
5. **Margin Analysis** (`/margin`) — Executive financial dashboard with KPIs and Recharts charts
6. **Reports** (`/reports`) — Tabular report exports with filters and CSV download

## App-Level State

- `selectedProjectId` — persisted in localStorage, drives Estimates/Consumption/Margin pages
- `selectedWeekNumber` — persisted in localStorage, used in consumption tracking

## Seeding

```bash
pnpm --filter @workspace/scripts run seed
```

Seeds 4 realistic projects (Mumbai construction/electrical), 11 estimate rows, and 14 weekly consumption entries.

## Codegen

After changing `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Workflows

- API Server: `pnpm --filter @workspace/api-server run dev`
- Frontend: `pnpm --filter @workspace/interphase-dashboard run dev`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — only emit `.d.ts` files during typecheck
