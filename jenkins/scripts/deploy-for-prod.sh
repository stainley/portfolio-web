#!/usr/bin/env sh
echo 'Building Image for PRODUCTION'
PORTFOLIO_VERSION=$APP_VERSION_ID
APP_NAME=$REACT_APP_NAME

echo "Cleaning Container: " docker container ls -q --filter "name=$APP_NAME"
docker container ls -q --filter "name=$APP_NAME" | grep -q . && docker container stop "$APP_NAME" && docker container rm -fv "$APP_NAME"


echo "Building Docker Image $PORTFOLIO_VERSION"
#docker  build -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
docker  build --build-arg "$PORTFOLIO_VERSION" -t "stainley/$APP_NAME:$PORTFOLIO_VERSION stainley/$APP_NAME:latest" -f Dockerfile.prod .
#echo 'building a tag'

echo "Removing intermediate Image for $APP_NAME:$PORTFOLIO_VERSION"
docker image prune --force --filter label=stage=builder --filter label=build="$PORTFOLIO_VERSION"

echo "Uploading image to Docker Hub: stainley/$APP_NAME:$PORTFOLIO_VERSION"
docker push "stainley/$APP_NAME:$PORTFOLIO_VERSION stainley/$APP_NAME:latest"
echo "----- Docker Image uploaded to Docker Hub successfully ----"
