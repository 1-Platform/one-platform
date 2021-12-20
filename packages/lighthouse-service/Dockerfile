FROM node:14-alpine
LABEL Name=one-platform-lighthouse-service \
  Version=0.0.3 \
  maintainer="mdeshmuk@redhat.com"

# Building the lighthouse microservice
ADD  . /app
WORKDIR /app
RUN apk add chromium
RUN npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "node", "dist/bundle.js"]
