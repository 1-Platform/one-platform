FROM cypress/browsers:node14.16.0-chrome89-ff86
LABEL Name=one-platform-lighthouse-service \
  Version=0.0.1 \
  maintainer="mdeshmuk@redhat.com"

# Building the lighthouse microservice
ADD  . /app
WORKDIR /app
RUN npm install -g @lhci/cli && \
  npm install --silent && \
  npm run build

ENV PORT 8080
EXPOSE 8080

CMD [ "node", "dist/bundle.js"]
