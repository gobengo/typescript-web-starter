FROM node:9-alpine as build-stage

RUN apk add --update git && \
  rm -rf /tmp/* /var/cache/apk/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app
RUN npm run build
ARG NPM_PRUNE
RUN if ! [ -z "$NPM_PRUNE" ]; then npm prune; fi

FROM node:9-alpine as run-stage
COPY --from=build-stage /usr/src/app /usr/src/app
WORKDIR /usr/src/app

# default to port 80 for node, and 5858 or 9229 for debug
ARG PORT=80
ENV PORT $PORT

CMD ["npm", "start"]
