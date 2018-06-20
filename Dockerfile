FROM node:alpine

WORKDIR /app
COPY server/package.json .
COPY server/server.js .
COPY server/controller controller
COPY server/model model
COPY server/persistence persistence
COPY server/public public
COPY presentacion public/presentacion

RUN npm install --production

EXPOSE 8011
#VOLUME ["/app/public"]

CMD ["node", "server.js"]
