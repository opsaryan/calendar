# @calendar/api

Express REST API for the calendar app. See the [root README](../../README.md) for setup, endpoints and tests.

```bash
cp .env.template .env
pnpm dev    # watch mode
pnpm start
pnpm test   # in-memory MongoDB
```

- `app.js` – Express app (routes, middleware), imported by tests
- `index.js` – connects to MongoDB and starts the server
