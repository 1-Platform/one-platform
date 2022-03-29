FROM node:16-alpine
LABEL Name=one-platform-api-gateway-service \
  Version=0.2.0 \
  maintainer="mdeshmuk@redhat.com"

WORKDIR /usr/src
ADD  . .

# Building the user-group microservice
RUN npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "npm", "start"]
