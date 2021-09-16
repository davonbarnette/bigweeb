#!/usr/bin/env bash
aws ecr get-login-password --profile famr-admin --region us-east-1 | docker login --username AWS --password-stdin 598745155627.dkr.ecr.us-east-1.amazonaws.com &&
docker build -t famr-portal . &&
docker tag famr-portal:latest 598745155627.dkr.ecr.us-east-1.amazonaws.com/famr-portal:latest &&
docker push 598745155627.dkr.ecr.us-east-1.amazonaws.com/famr-portal:latest
