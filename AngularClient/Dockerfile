FROM node:alpine as build
LABEL maintainer="Charles Hill <chasehill70@gmail.com>"

RUN mkdir /ang
WORKDIR /ang
COPY package.json package-lock.json /ang/
RUN npm install
COPY . /ang/
RUN npm run build:prod -- --output-path=./dist/out

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /ang/dist/out /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80