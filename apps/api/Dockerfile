FROM node:24-bookworm-slim AS build

WORKDIR /build/

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs24-debian13:nonroot 

COPY --from=build /build/ .

COPY . .

CMD [ "index.js" ]
