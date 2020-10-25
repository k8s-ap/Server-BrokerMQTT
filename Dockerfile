# Mosca
#
# VERSION 2.5.2

FROM mhart/alpine-node:6
#MAINTAINER Matteo Collina <hello@matteocollina.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY ./ /usr/src/app/

#RUN apk update && \
#    apk add make gcc g++ python git zeromq-dev krb5-dev && \
#    npm install --unsafe-perm --production && \
#    apk del make gcc g++ python git
RUN npm install 
# RUN npm run build <-- no estaba comentado

EXPOSE 80
EXPOSE 1883

#ENTRYPOINT ["/usr/src/app/bin/mosca", "-d", "/db", "--http-port", "80", "--http-bundle", "-v"]
#https://riptutorial.com/es/docker/example/2700/diferencia-entre-entrypoint-y-cmd 
# CMD ["node","dist/broker.js"]
# CMD ["node","src/broker.js"]
CMD ["ls"]