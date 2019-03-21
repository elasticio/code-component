FROM node:10-alpine AS base
WORKDIR /app

COPY ./ /app

FROM base AS dependencies
RUN apk update && apk add bash python g++ make libstdc++
RUN npm install --production

FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
RUN chown -R node:node .
USER node
ENTRYPOINT ["node", "./node_modules/elasticio-sailor-nodejs/run.js"]
