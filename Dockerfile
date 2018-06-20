FROM node

WORKDIR /app
COPY server/package.json .
COPY server/server.js .
COPY server/controller controller
COPY server/model model
COPY server/persistence persistence
COPY server/public public
COPY presentacion public/presentacion

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    python \
    python-dev \
    libcairo2-dev libjpeg-dev libgif-dev \
  && rm -rf /var/cache/apk/*

RUN apt-get install -y libcairo2-dev libpango1.0-dev build-essential g++

RUN npm install --production --unsafe-perm

EXPOSE 8011
#VOLUME ["/app/public"]

CMD ["node", "server.js"]
