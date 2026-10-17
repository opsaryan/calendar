FROM node:24-bookworm-slim AS pruner

WORKDIR /prune/

RUN npm install -g pnpm

COPY . . 

ARG PACKAGE

RUN pnx turbo prune ${PACKAGE}


FROM node:24-bookworm-slim AS deps

WORKDIR /deps/

RUN npm install -g pnpm

COPY --from=pruner /prune/out/json/ . 
COPY --from=pruner /prune/out/pnpm-lock.yaml . 
COPY --from=pruner /prune/out/pnpm-workspace.yaml .

RUN pnpm install --frozen-lockfile


FROM node:24-bookworm-slim AS build

WORKDIR /build/

RUN npm install -g pnpm

COPY --from=deps /deps/ .

COPY --from=pruner /prune/out/full/ .

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN pnx turbo run build

RUN ls .


FROM gcr.io/distroless/nodejs24-debian13:nonroot AS backend 

WORKDIR /app/

COPY --from=deps /deps/ . 

COPY --from=pruner /prune/out/full/ . 

CMD [ "apps/api/app.js" ]


FROM nginx:1.31.7-alpine AS frontend

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /build/apps/web/dist/ /usr/share/nginx/html/