FROM ubuntu:18.04

WORKDIR /data
#RUN useradd -M -l www-data -b /data
RUN apt-get update &&  DEBIAN_FRONTEND=noninteractive apt-get install -y apache2 libapache2-mod-php
RUN apt-get update &&  DEBIAN_FRONTEND=noninteractive apt-get install -y sqlite3 php-pdo-sqlite php-xml
RUN apt-get update &&  DEBIAN_FRONTEND=noninteractive apt-get install -y graphviz

RUN rm /etc/apache2/sites-enabled/000-default.conf
RUN ln -s /data/dev/hpccf-wiki.conf /etc/apache2/sites-enabled/
RUN a2enmod rewrite

CMD /data/dev/run-internal.sh
