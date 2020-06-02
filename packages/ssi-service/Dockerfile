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
RUN cp public/index.html /usr/share/httpd/noindex/ && \
  chmod a+x /usr/share/httpd/noindex/index.html && \
  mkdir /var/www/html/templates && \
  cp -r dist/** /var/www/html/templates && \
  mkdir -p /var/www/html/.include && \
  cp -r dist/** /var/www/html/.include

USER 1001
