FROM node:16-bullseye-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

EXPOSE 8000

ENV HOST=0.0.0.0
ENV PORT=8080

RUN yarn build

CMD [ "yarn", "start" ]