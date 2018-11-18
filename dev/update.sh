#!/bin/bash

(
cd /home/www/hpccertification/skill-tree-wiki
git pull -q

git add wiki/data/media wiki/data/pages

git commit -m "autocommit"


cd skill-tree
git pull -q

) > /dev/null

