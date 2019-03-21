FROM node:10-alpine AS base
WORKDIR /app
RUN apk update && apk add --no-cache \
    bash
COPY actions actions
COPY component.json component.json
COPY package.json package.json
COPY README.md README.md

FROM base AS dependencies
RUN apk update && apk add --no-cache \
    python \
    g++ \
    make
RUN npm install --production

FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
RUN chown -R node:node .
USER node
ENTRYPOINT ["node", "./node_modules/elasticio-sailor-nodejs/run.js"]
