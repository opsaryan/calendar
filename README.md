# Calendar

Personal calendar app: sign up, log in, and manage private events (title, notes, start, end).
Monorepo with an Express + MongoDB API and a React client.

```
.
├── apps/
│   ├── api/   Express REST API (Node, MongoDB/Mongoose, JWT auth)
│   └── web/   React client (Vite, Redux Toolkit, React Router, react-big-calendar)
├── packages/  shared internal packages (none yet)
├── package.json         root scripts
├── pnpm-workspace.yaml  workspace packages + allowed build scripts
└── turbo.json     Turborepo task pipeline
```

pnpm workspaces + [Turborepo](https://turborepo.com). One `pnpm-lock.yaml` at the root; dependencies are
listed in each app's own `package.json`.

The API and the web client are deployed separately. The client is a static build (`apps/web/dist`) served by
any static host; it calls the API at `VITE_API_URL` (set at build time).

## Quick start

Requires Node 24+, pnpm 12 and a MongoDB instance.

```bash
pnpm install

cp apps/api/.env.template apps/api/.env                       # set DB_CONN + SECRET_JWT_SEED
cp apps/web/.env.development.template apps/web/.env.development

pnpm dev           # api on :4000, web on :5173
```

## Scripts (root)

| Script      | What it does                                                        |
| ----------- | ------------------------------------------------------------------- |
| `dev`       | API (`node --watch`) + Vite dev server                              |
| `build`     | Build every package that has a `build` script                      |
| `test`      | All tests (cached by turbo)                                         |
| `test:api`  | API tests (in-memory MongoDB, no setup needed)                      |
| `test:web`  | Client tests (API calls mocked, no setup needed)                    |

Add a dependency to one app: `pnpm add <pkg> --filter @calendar/web` (or `pnpm add <pkg>` inside the app folder).
Run a root script with `pnpm <script>`, e.g. `pnpm test:api`.

## Tests

**API** – `node:test` + `supertest` + `mongodb-memory-server`. Covers auth (register/login/renew),
events CRUD and ownership rules, validation, JWT middleware and helpers.

**Web** – Jest + React Testing Library. Redux slices, hooks, router and components;
HTTP calls to the API are mocked, so no backend or env file is needed.

## API

All routes are under `/api`. Event routes need the `x-token` header (JWT from login/register).

| Method | Path               | Body                                |
| ------ | ------------------ | ----------------------------------- |
| POST   | `/auth/new`        | `name`, `email`, `password`         |
| POST   | `/auth/login`      | `email`, `password`                 |
| GET    | `/auth/renew`      | –                                   |
| GET    | `/events`          | –                                   |
| POST   | `/events`          | `title`, `start`, `end`, `notes?`   |
| PUT    | `/events/:id`      | `title`, `start`, `end`, `notes?`   |
| DELETE | `/events/:id`      | –                                   |

`GET /health` returns `{ ok: true }`.

## Deploy

- **Docker** – `apps/api/Dockerfile` (distroless Node 24).
- **Kubernetes** – manifests in `apps/api/manifests` (API + MongoDB).
