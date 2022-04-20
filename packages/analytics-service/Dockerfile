FROM node:16-alpine
LABEL Name=one-platform-api-catalog-service \
    Version=0.4.3 \
    maintainer="mdeshmuk@redhat.com"

# Building the user-group microservice
ADD  . /app
WORKDIR /app
RUN npm install --silent && \
    npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "node", "dist/index.js"]
