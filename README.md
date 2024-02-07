# Development environment

This is the development environment for the online editable skill-tree wiki.

## Description

The development environment for the wiki is provided as a Docker image.

## Setup

* To setup a docker environment, go to the ./dev directory and run ./create-container.sh

## Execution

* To run the container go to the ./dev directory and execute ./run-container.sh
* Visit with your browser the URL [http://localhost:8888](http://localhost:8888)
* You need to copy the file /wiki/conf/users.auth.php.dist to /wiki/conf/users.auth.php for the authentication
* The user account is admin / admin

## FAQ

* F: I need sudo to run the container?
* A: Add your user to the docker group.
