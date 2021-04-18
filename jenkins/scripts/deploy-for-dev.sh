#!/usr/bin/env sh
echo 'Building Image for DEV'
BUILD_ID=$BUILD_DEV_ID
PORTFOLIO_VERSION=0.1.2
echo "Building Docker Image $BUILD_DEV_ID"
docker  build --build-arg "$BUILD_ID" -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
#echo 'building a tag'
#docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
#Removing intermediate Image
docker image prune --filter label=stage=builder --filter label=build="$BUILD_ID"
