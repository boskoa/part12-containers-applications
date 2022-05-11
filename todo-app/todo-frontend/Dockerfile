FROM node:16 AS build-stage

WORKDIR usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN CI=true npm test

RUN npm run build

RUN npm install -g serve

USER node

CMD ["serve", "build"]