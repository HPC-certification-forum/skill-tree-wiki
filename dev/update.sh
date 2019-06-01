#!/bin/bash

(
cd /home/www/hpccertification/skill-tree-wiki
git pull -q

git add wiki/conf/local.php
git add wiki/data/media wiki/data/pages
git commit -m "autocommit"
git push -q


cd skill-tree

git add -A *
git commit -m "autocommit from the webpage"
git pull -q
git push -q


) > /dev/null

