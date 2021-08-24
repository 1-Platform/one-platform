FROM node:12-alpine
LABEL Name="one-platform-reverse-proxy" \
  Version="1.0.0" \
  Maintainer="mdeshmuk@redhat.com"

ENV NODE_ENV=development
WORKDIR /usr/src

ADD . .
RUN npm install --silent \
  && npm run build

EXPOSE 8080
CMD ["npm", "start"]