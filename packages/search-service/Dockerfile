FROM node:16-alpine
LABEL Name=one-platform-search-service \
  Version=0.1.0 \
  maintainer="mdeshmuk@redhat.com"

WORKDIR /use/src

ADD  . .

# Building the search microservice
RUN npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "npm", "start"]
