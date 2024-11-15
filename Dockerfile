ARG BASE_IMAGE=node:18-alpine

###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM --platform=linux/amd64 $BASE_IMAGE AS development

RUN apk --no-cache add --virtual native-deps libc6-compat && \
 apk add tzdata && \
 cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
 echo "Asia/Bangkok" > /etc/timezone && \
 apk del tzdata && \
 apk del native-deps

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm i

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################
FROM --platform=linux/amd64 $BASE_IMAGE AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm i --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################
FROM --platform=linux/amd64 $BASE_IMAGE AS production

RUN apk --no-cache add --virtual native-deps libc6-compat && \
 apk add tzdata && \
 cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
 echo "Asia/Bangkok" > /etc/timezone && \
 apk del tzdata && \
 apk del native-deps

RUN mkdir -p /app

RUN chown node:node -R /app

WORKDIR /app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json ./

EXPOSE 3000

CMD [ "node", "dist/main.js" ]


