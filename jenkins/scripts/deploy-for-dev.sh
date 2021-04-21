#!/usr/bin/env sh
echo 'Building Image for DEVELOPMENT'
PORTFOLIO_VERSION=$APP_VERSION_ID
APP_NAME=$REACT_APP_NAME

echo "Cleaning Container: " docker container ls -q --filter "name=$APP_NAME"
docker container ls -q --filter "name=$APP_NAME" | grep -q . && docker container stop "$APP_NAME" && docker container rm -fv "$APP_NAME"


echo "Building Docker Image $APP_NAME-dev:$PORTFOLIO_VERSION"
#docker  build -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
docker  build --build-arg "$PORTFOLIO_VERSION" -t "stainley/$APP_NAME-dev:$PORTFOLIO_VERSION" -t "stainley/$APP_NAME-dev:latest" -f Dockerfile.dev .
#docker  build --build-arg "$PORTFOLIO_VERSION" -t stainley/portfolio-web-dev:"$PORTFOLIO_VERSION" -f Dockerfile.dev .
#echo 'building a tag'
#docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
echo "Removing intermediate Image for $APP_NAME:$PORTFOLIO_VERSION"
docker image prune --force --filter label=stage=builder --filter label=build="$PORTFOLIO_VERSION"
