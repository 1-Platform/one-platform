FROM node:16-alpine
LABEL Name="one-platform-notifications-service" \
  Version="2.0.0" \
  maintainer="mdeshmuk@redhat.com"

ENV NODE_ENV=development
WORKDIR /usr/src/app

ADD . .
RUN npm install --silent && npm run build

EXPOSE 8080

CMD ["npm", "start"]
