FROM spaship/httpd
LABEL Name=one-platform-ssi \
  Version=0.0.1 \
  maintainer="mdeshmuk@redhat.com"

# Installing nodejs & npm
USER root
RUN microdnf install -y npm && microdnf clean all

ADD . /ssi

WORKDIR /ssi

RUN npm install --silent && \
  npm run build
RUN cp public/index.html /var/www/html/ && \
  chmod a+x /var/www/html/index.html && \
  mkdir -p /var/www/html/.include/nav && \
  cp -r dist/** /var/www/html/.include/nav/

USER 1001
