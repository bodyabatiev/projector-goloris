FROM node:8

RUN apt-get update
RUN npm install -g nodemon

ADD . /src/
WORKDIR /src/

ARG RUNBY=node
ENV RUNBY ${RUNBY}
CMD ${RUNBY} "/src/app.js"
