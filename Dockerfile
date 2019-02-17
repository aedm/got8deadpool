FROM node:8 as build

RUN apt-get -qq update
RUN apt-get -y install curl procps python g++ make sudo git bzip2 libc6 >/dev/null
RUN curl "https://install.meteor.com/" | sh

ADD . /build
WORKDIR /build
RUN ls -la
RUN meteor npm install
RUN meteor build --allow-superuser --directory /app
WORKDIR /app/bundle/programs/server
RUN npm install

FROM node:8

COPY --from=build /app /app
WORKDIR /app/bundle

ENV PORT=3000

CMD ["node", "main.js"]