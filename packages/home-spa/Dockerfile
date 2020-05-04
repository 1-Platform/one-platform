FROM spaship/httpd
LABEL Name=one-platform-home-spa \
    Version=0.0.1 \
    maintainer="mdeshmuk@redhat.com"

# Installing nodejs & npm
USER root
RUN microdnf install -y npm && microdnf clean all

# Building the Home SPA
ADD . /app
WORKDIR /app
RUN npm install --silent && \
    npm run build

RUN cp -r dist/* /var/www/html/

USER 1001
