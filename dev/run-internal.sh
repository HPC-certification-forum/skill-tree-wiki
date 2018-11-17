#!/bin/bash
adduser --system --no-create-home --home /data --uid 1000  www-user
sed -i "s/APACHE_RUN_USER=www-data/APACHE_RUN_USER=www-user/" /etc/apache2/envvars
/etc/init.d/apache2 start
tail -f /var/log/apache2/error.log &
/bin/bash
