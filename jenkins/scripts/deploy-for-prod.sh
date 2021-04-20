#!/usr/bin/env sh
echo 'Building Image for PRODUCTION'
PORTFOLIO_VERSION=$APP_VERSION_ID

echo "Cleaning Container: " docker container ls -q --filter "name=portfolio-web"
docker container ls -q --filter "name=portfolio-web" | grep -q . && docker container stop portfolio-web && docker container rm -fv portfolio-web


echo "Building Docker Image $PORTFOLIO_VERSION"
#docker  build -t stainley/portfolio-web-dev:$PORTFOLIO_VERSION -f Dockerfile.dev .
docker  build --build-arg "$PORTFOLIO_VERSION" -t stainley/portfolio-web:"$PORTFOLIO_VERSION" -f Dockerfile.prod .
#echo 'building a tag'
#docker tag portfolio-web-dev stainley/portfolio-web:$PORTFOLIO_VERSION
echo "Removing intermediate Image for $PORTFOLIO_VERSION"
docker image prune --force --filter label=stage=builder --filter label=build="$PORTFOLIO_VERSION"
