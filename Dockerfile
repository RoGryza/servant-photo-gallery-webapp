FROM node:13

RUN mkdir -p /app/user
WORKDIR /app/user
COPY package.json yarn.lock /app/user/

RUN yarn
COPY ./ /app/user/