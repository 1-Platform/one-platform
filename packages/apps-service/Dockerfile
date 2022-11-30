FROM registry.access.redhat.com/ubi8/nodejs-16-minimal
LABEL Name="one-platform-apps-service" \
  Version="1.3.0" \
  maintainer="mdeshmuk@redhat.com"

WORKDIR /opt/app-root/src/app

ADD . .

USER root
RUN chmod a+w -R .
USER 1001
RUN npm install && npm run build

EXPOSE 8080

CMD ["npm", "start"]
