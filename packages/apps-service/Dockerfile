## Build stage
FROM registry.access.redhat.com/ubi8/nodejs-16 as builder

ADD --chown=1001:0 . $HOME

RUN npm install && npm run build
RUN chmod -R g=u .

## Final stage
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal
LABEL Name="one-platform-apps-service" \
  Version="2.0.1" \
  maintainer="mdeshmuk@redhat.com" \
  description="This Service provides the essential GraphQL APis for One Platform Developer Console"

COPY --from=builder $HOME/package*.json .
RUN npm install --omit=dev

COPY --from=builder $HOME/dist $HOME/dist
COPY --from=builder $HOME/.env.example .

EXPOSE 8080

CMD ["node", "dist/index.js"]
