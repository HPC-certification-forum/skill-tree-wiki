#!/bin/bash

(
cd /home/www/hpccertification/skill-tree-wiki
git pull -q

cd skill-tree
git pull -q

) > /dev/null

