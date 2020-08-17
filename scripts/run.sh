#!/usr/bin/env bash
docker login &&
docker pull davonbarnette/bigweeb:latest &&
docker rm -f bigweeb
docker run --env-file bigweeb.env -p 8080:8080 davonbarnette/bigweeb