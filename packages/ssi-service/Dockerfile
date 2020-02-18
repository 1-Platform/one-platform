FROM httpd:2-alpine
LABEL Name=one-platform-ssi Version=0.0.0

WORKDIR /usr/local/apache2/htdocs

ADD httpd.conf /usr/local/apache2/conf/httpd.conf

ADD src templates
ADD public/* ./
