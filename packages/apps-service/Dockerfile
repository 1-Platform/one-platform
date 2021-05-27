FROM node:12-alpine
LABEL Name="one-platform-apps-service" \
  Version="1.0.0" \
  maintainer="mdeshmuk@redhat.com"

ENV NODE_ENV=development
WORKDIR /usr/src

ADD . .
RUN npm install --silent

EXPOSE 8080

CMD ["npm", "start"]
