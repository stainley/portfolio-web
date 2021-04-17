#!/usr/bin/env sh
echo 'Building Image for DEV'
PORTFOLIO_VERSION=0.1.1
echo 'Building Docker Image'
docker  build -t portfolio-web-dev -f Dockerfile.dev .
echo 'building a tag'
docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
