## Build stage
FROM registry.access.redhat.com/ubi8/nodejs-16 as builder

ADD --chown=1001:0 . $HOME/

RUN npm install --silent && npm run build
RUN chmod -R g=u .

## Final stage
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal
LABEL Name="one-platform-reverse-proxy" \
  Version="1.3.0" \
  maintainer="mdeshmuk@redhat.com"

COPY --from=builder $HOME/package*.json ./
RUN npm install --omit=dev

COPY --from=builder $HOME/dist $HOME/dist
COPY --from=builder $HOME/.env.example .

EXPOSE 8080

CMD ["node", "--max-http-header-size=10485760", "dist/index.js"]
