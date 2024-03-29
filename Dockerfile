FROM node:18-alpine AS base
WORKDIR /app
RUN apk update && apk add --no-cache \
    bash
COPY actions actions
COPY component.json component.json
COPY package.json package.json
COPY README.md README.md

FROM base AS dependencies
RUN apk update && apk add --no-cache \
    python3 \
    g++ \
    make
RUN npm install --omit=dev

FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
RUN chown -R node:node .
USER node
ENTRYPOINT ["node", "./node_modules/elasticio-sailor-nodejs/run.js"]
