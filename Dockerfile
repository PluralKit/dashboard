FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache git
WORKDIR /app
COPY . .

FROM base AS deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
ARG base_api_url=https://api.pluralkit.me
ARG repository_url=https://github.com/PluralKit/dashboard
RUN pnpm install --frozen-lockfile
RUN PUBLIC_REPOSITORY_URL=${repository_url} \
  PUBLIC_BASE_API_URL=${base_api_url} \
  pnpm build

FROM base
LABEL org.opencontainers.image.source = "https://github.com/PluralKit/dashboard"

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
