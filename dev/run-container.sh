#!/bin/bash
docker run -p 127.0.0.1:8888:80 -h hpcf -it --rm  -v $PWD/../:/data/ hpccf/wiki
