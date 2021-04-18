#!/usr/bin/env sh
echo 'Building Image for DEV'
PORTFOLIO_VERSION=0.1.2
echo 'Building Docker Image'
docker  build -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
#echo 'building a tag'
#docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
