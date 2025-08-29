# Next.js Boilerplate — Create Next CoE

Welcome to the GeekyAnts Next.js default boilerplate tailored for production apps. This starter focuses on performance, observability, analytics, type‑safety, and a modern UI kit, without vendor lock‑in. We’ve done the heavy lifting so you can ship faster. 🌍

## 📏 Conventions & Guidelines

### Nomenclature

- **File and folder names must be kebab-case**. Do not use PascalCase, camelCase, or snake_case.
- **Co-locate by usage hierarchy**: place folders and libraries within the app areas they serve. Follow Next.js colocation with `_private` folders as needed (see the [Next.js colocation docs](https://nextjs.org/docs/app/getting-started/project-structure#colocation)).

### Guidelines

- **Read this README** to understand the setup and conventions.
- **Remove unneeded pieces** based on your client's product requirements.

### Maintenance Note

- **Dependencies will be updated every 15 days.**

## 📚 Features

With this template, you get the following out of the box. Suggestions and improvements are welcome!

- 🏎️ **[Next.js 15](https://nextjs.org/)**: App Router, React 19, typed routes, Turbopack dev
- 💅 **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility‑first styling with prebuilt UI primitives
- ✨ **[ESLint](https://eslint.org/)** and **[Prettier](https://prettier.io/)**: Clean, consistent code
- 🛡️ **Type‑safe env with [@t3‑oss/env‑nextjs](https://env.t3.gg/)**: Build‑time validation via Zod
- 📈 **Analytics**: PostHog (dead‑clicks, heatmaps, performance), Vercel Analytics, Speed Insights, GTM proxy
- 🧪 **Feature flags & experiments**: PostHog flags powering the homepage hero
- 🛡️ **Error tracking**: Sentry across client, server, and edge, unified with PostHog
- 🔎 **OpenAPI Reference**: Generated docs (via `next-openapi-gen`) rendered with Scalar at `/reference`
- 🔐 **SEO**: OpenGraph, Twitter cards, sitemap, robots, JSON‑LD
- 🚀 **Performance tooling**: Bundle analyzer (`pnpm analyze`), optimized package imports
- 📦 **Absolute imports & path aliases**: `@/*`, `@/components/*`, `@/app/*`, etc.
- 🪝 **Husky pre‑commit**: Typecheck, circular‑dep check, lint, build (commands present; currently commented)

## 📋 Table of Contents

- [📚 Features](#-features)
- [📏 Conventions & Guidelines](#-conventions--guidelines)
- [📊 Sequence Diagrams](#-sequence-diagrams)
- [🎯 Getting Started](#-getting-started)
- [🚀 Deployment](#-deployment)
- [📃 Scripts Overview](#-scripts-overview)
- [📡 Observability & Analytics](#-observability--analytics)
- [📕 OpenAPI Reference](#-openapi-reference)
- [🗄️ Database & Drizzle ORM](#-database--drizzle-orm)
- [🎨 Styling and UI](#-styling-and-ui)
- [🔗 Coupling Graph](#-coupling-graph)
- [🧪 Testing](#-testing)
- [💻 Environment Variables](#-environment-variables)
- [🔎 Useful Routes](#-useful-routes)
- [📄 License](#-license)

## 📊 Sequence Diagram

TBA Later

## 🎯 Getting Started

Prereqs:

- Node.js ≥ 22
- [pnpm](https://pnpm.io/) (project uses `packageManager: pnpm`)

1. Clone the repository

```bash
git clone https://github.com/geekysaurabh001/create-next-coe
cd create-next-coe
```

2. Install dependencies

```bash
pnpm install
```

3. Setup environments

```bash
# Server
NODE_ENV=development
ANALYZE=false
POSTHOG_API_KEY=phc_***************************************
POSTHOG_ENV_ID=env_********
SENTRY_AUTH_TOKEN=***
# Database
# Choose one: postgresql | mysql | sqlite
DB_DIALECT=postgresql
# For Postgres via docker compose
DATABASE_URL=postgres://create-next-coe:create-next-coe@localhost:5432/create-next-coe
# For MySQL via docker compose
# DATABASE_URL=mysql://create-next-coe:create-next-coe@localhost:3306/create-next-coe
# For SQLite (repo includes create-next-coe.db at project root)
# DATABASE_URL=./create-next-coe.db

# Client
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_TITLE=Create Next CoE
NEXT_PUBLIC_APP_NAME=Create Next CoE
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DESCRIPTION=Production‑ready Next.js starter
NEXT_PUBLIC_APP_CATEGORY=app
NEXT_PUBLIC_APP_KEYWORDS=nextjs,starter,boilerplate
NEXT_PUBLIC_GTM_KEY=GTM-XXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_***************************************
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_POSTHOG_INGEST=/ingest
NEXT_PUBLIC_POSTHOG_ENVIRONMENT=development
```

4. Run the development server

```bash
pnpm dev
```

5. Open `http://localhost:3000` in your browser.

## 🚀 Deployment

Deploy on Vercel in minutes:

[![Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/geekysaurabh001/create-next-coe)

## 📃 Scripts Overview

Available scripts in `package.json`:

- `dev`: Generate OpenAPI types and start Next dev with Turbopack
- `build`: Build the app for production
- `analyze`: Build with bundle analysis enabled
- `start`: Start the production server
- `lint`: Lint `src` with ESLint
- `lint:fix`: Fix lint issues
- `type:generate`: Generate typed routes (`next typegen`)
- `type:check`: Typecheck with `tsc --noEmit`
- `type:circular`: Detect circular dependencies with Madge
- `prepare`: Setup Husky
- `format`: Format all files with Prettier
- `next-openapi-gen`: CLI wrapper for OpenAPI generation
- `husky:init`: Initialize Husky hooks

Pro tips:

- Run `pnpm analyze` to enable the Next.js bundle analyzer.
- Path aliases are configured in `tsconfig.json` (`@/*`, `@/components/*`, etc.).

## 📡 Observability & Analytics

- **PostHog**: Privacy‑friendly analytics, session replays, heatmaps, feature flags.
  - Proxied via Next rewrites to `/ingest` to reduce ad‑blocker impact.
  - Server and client capture are configured; exceptions are unified with Sentry.
- **Sentry**: Error tracking for client, server, and edge.
  - Source maps uploaded on build; tunnel at `/monitoring`.
- **Vercel Analytics** and **Speed Insights** are wired in.
- **Google Tag Manager**: Proxied endpoints (e.g., `/gm`, `/gtm/:path*`).

## 📕 OpenAPI Reference

- Author API routes under `src/app/api` and keep your OpenAPI schema updated.
- The UI at `/reference` renders `public/openapi.json` with Scalar.
- During dev, `pnpm dev` runs `next-openapi-gen generate` before starting the dev server.

## 🗄️ Database & Drizzle ORM

Drizzle ORM is configured with `drizzle-kit` for migrations and `src/db/client.ts` for runtime access. You can switch between Postgres, MySQL, and SQLite.

- Schemas: `src/db/schema/postgres.ts`, `src/db/schema/mysql.ts`, `src/db/schema/sqlite.ts`
- Migrations output: `src/db/drizzle/<dialect>`
- Config: `drizzle.config.ts` uses `DB_DIALECT` and `DATABASE_URL`
- Runtime client: `src/db/client.ts` auto‑selects the driver based on `DB_DIALECT`

1. Start a local database (optional, for Postgres/MySQL)

```bash
pnpm docker:up        # starts postgres, mysql, redis
pnpm docker:logs      # follow logs (optional)
# pnpm docker:down    # stop services
```

2. Set environment variables

- For the app: add to `.env` (already shown in Getting Started)
- For Drizzle CLI: add to `.env` (drizzle‑kit reads `.env` by default)

Examples:

```bash
# Redis
REDIS_PASSWORD="coe-next-boilerplate"
REDIS_PORT="6379"

# Postgres
POSTGRES_DB="coe-next-boilerplate"
POSTGRES_USER="coe-next-boilerplate"
POSTGRES_PASSWORD="coe-next-boilerplate"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
# DB_DIALECT=postgresql
# DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

# MySQL
MYSQL_DATABASE="coe-next-boilerplate"
MYSQL_ROOT_PASSWORD="coe-next-boilerplate"
MYSQL_USER="coe-next-boilerplate"
MYSQL_PASSWORD="coe-next-boilerplate"
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
# DB_DIALECT=mysql
# DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}$/${MYSQL_DATABASE}

# SQLite
# DB_DIALECT=sqlite
# DATABASE_URL=./create-next-coe.db
```

3. Generate and run migrations

Generic (reads `DB_DIALECT`):

```bash
pnpm db:generate   # generate SQL migrations from schema
pnpm db:migrate    # apply migrations
```

Dialect‑specific shortcuts:

```bash
pnpm db:pg:gen && pnpm db:pg:mig
pnpm db:mysql:gen && pnpm db:mysql:mig
pnpm db:sqlite:gen && pnpm db:sqlite:mig
```

4. Explore with Drizzle Studio

```bash
pnpm db:pg:studio
# or
pnpm db:mysql:studio
pnpm db:sqlite:studio
```

Advanced:

```bash
# push/pull schema where supported
pnpm db:pg:push && pnpm db:pg:pull
```

## 🎨 Styling and UI

- **Tailwind CSS v4** for styling.
- A modern, accessible component set lives in `src/components/ui` (buttons, dialogs, tables, sheets, charts, forms, and more).

## 🔗 Coupling Graph

- Detect circular dependencies:

```bash
pnpm type:circular
```

## 🧪 Testing

- This starter does not include a testing setup by default. Add Jest/RTL or Playwright as needed for your project.

## 💻 Environment Variables

Environment validation is defined in `env.ts` using `@t3-oss/env-nextjs` + `zod`. Required keys include (non‑exhaustive):

- Server: `NODE_ENV`, `ANALYZE`, `POSTHOG_API_KEY`, `POSTHOG_ENV_ID`, `SENTRY_AUTH_TOKEN`
- Client: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_APP_TITLE`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_DESCRIPTION`, `NEXT_PUBLIC_APP_CATEGORY`, `NEXT_PUBLIC_APP_KEYWORDS`, `NEXT_PUBLIC_GTM_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_POSTHOG_INGEST` (defaults to `/ingest`), `NEXT_PUBLIC_POSTHOG_ENVIRONMENT`

Example `.env`:

```bash
# Development environment keys
NODE_ENV="development"
ANALYZE="false"

# App environment keys
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_APP_TITLE="Next.js 15 CoE Setup"
NEXT_PUBLIC_APP_NAME="Next.js 15 CoE Setup"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_CATEGORY="Next.js Setup"
NEXT_PUBLIC_APP_DESCRIPTION="Next.js 15 CoE Setup"
NEXT_PUBLIC_APP_KEYWORDS="private setup, center of excellence, docs"

# GTM environment key
NEXT_PUBLIC_GTM_KEY=""

# Posthog analytics environment keys
POSTHOG_API_KEY=""
POSTHOG_ENV_ID=""
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST=""
NEXT_PUBLIC_POSTHOG_INGEST="/ingest"
NEXT_PUBLIC_POSTHOG_ENVIRONMENT="development"

# Sentry authToken
SENTRY_AUTH_TOKEN=""

# Database
DB_DIALECT="postgresql"
DATABASE_URL="postgresql://create-next-coe:create-next-coe@127.0.0.1:5432/create-next-coe?sslmode=disable"

# DB_DIALECT="mysql"
# DATABASE_URL="mysql://create-next-coe:create-next-coe@127.0.0.1:3306/create-next-coe?sslmode=disable"

# DB_DIALECT="sqlite"
# DATABASE_URL="file:./create-next-coe.db"

```

## 🔎 Useful Routes

- Marketing page: `/`
- API Reference (Scalar): `/reference` (reads from `/openapi.json`)
- Example OpenAPI route: `/api/openapi/[id]`
- Sentry example API: `/api/sentry-example-api`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Auth states: `/unauthorized`, `/forbidden`

## 📄 License

MIT
