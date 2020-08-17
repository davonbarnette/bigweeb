#!/usr/bin/env bash
docker login &&
docker build -t bigweeb:latest . &&
docker tag bigweeb:latest davonbarnette/bigweeb:latest &&
docker push davonbarnette/bigweeb:latest