#!/usr/bin/env sh
echo 'Building Image for DEV'
BUILD_ID=$BUILD_DEV_ID
PORTFOLIO_VERSION=0.1.2

echo "Cleaning Container: " docker container ls -q --filter "name=portfolio-web"
docker container ls -q --filter "name=portfolio-web" | grep -q . && docker container stop portfolio-web && docker container rm -fv portfolio-web


echo "Building Docker Image $BUILD_DEV_ID"
#docker  build -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
docker  build --build-arg "$BUILD_ID" -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
#echo 'building a tag'
#docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
echo "Removing intermediate Image for $BUILD_DEV_ID"
docker image prune --force --filter label=stage=builder --filter label=build="$BUILD_ID"
