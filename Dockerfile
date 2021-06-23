FROM node:14.17.0 AS base
RUN npm install -g npm@7.15.0

FROM base AS all-dependencies
COPY package.json package-lock.json ./var/www/
WORKDIR /var/www
RUN npm clean-install --production=false && npx ngcc

FROM all-dependencies AS prod-dependencies
RUN npm prune --production

FROM all-dependencies AS build
COPY . .
RUN npm run build

FROM prod-dependencies AS release
COPY --from=build /var/www/dist ./dist/
COPY ./server-i18n.js ./server-i18n.js

ENV NODE_ENV=production \
    PORT=3000 \
    PRODUCTION_HOST=www.todo.com

EXPOSE $PORT
CMD npm start
