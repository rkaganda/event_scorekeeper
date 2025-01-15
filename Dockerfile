FROM node:latest

WORKDIR /usr/src/event_scoreboard

COPY package.json yarn.lock /usr/src/event_scoreboard/

RUN yarn install

COPY . /usr/src/event_scoreboard/

RUN yarn prisma db pull

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
