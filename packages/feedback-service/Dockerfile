FROM node:16-alpine
LABEL Name=one-platform-feedback-service \
  Version=0.1.0 \
  maintainer="mdeshmuk@redhat.com"

# Building the feedback microservice
ADD  . /app
WORKDIR /app
RUN npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "node", "dist/bundle.js"]
