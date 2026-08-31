# Next.js standalone on Fly — mirrors the other chrishayuk fly apps.
FROM node:22-alpine AS deps
RUN apk add --no-cache git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The site should know what it was built from. The deploy passes these
# in (see .github/workflows/deploy.yml); Next inlines them at build
# time, and a build that is given neither simply shows neither.
ARG GIT_COMMIT=""
ARG BUILD_DATE=""
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_COMMIT=$GIT_COMMIT NEXT_PUBLIC_BUILT=$BUILD_DATE
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
