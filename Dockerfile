FROM node:24-bookworm-slim AS pruner

WORKDIR /prune/

RUN npm install -g pnpm

COPY . . 

RUN pnx turbo prune @calendar/api

FROM node:24-bookworm-slim AS deps

WORKDIR /deps/

RUN npm install -g pnpm

COPY --from=pruner /prune/out/json/ . 
COPY --from=pruner /prune/out/pnpm-lock.yaml . 
COPY --from=pruner /prune/out/pnpm-workspace.yaml .

RUN pnpm install --frozen-lockfile --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot 

COPY --from=deps /deps/ . 

COPY --from=pruner /prune/out/full/ . 

CMD [ "apps/api/app.js" ]
