# exit when any command fails
set -e

# BUILD APP
echo "BUILDING APP"
mv ./app ./app_src
cd ./app_src
yarn -silent install --frozen-lockfile
yarn build
mv ./app ../app
cd ../
rm -rf ./app_src
yarn cache clean

# BUILD API
echo "BUILDING APP"
mv ./api ./api_src
cd ./api_src
yarn -silent install --frozen-lockfile
yarn build
cp ./package.json ./api/package.json
cp ./yarn.lock ./api/yarn.lock
mv ./api ../api
cd ../api
yarn --prod -silent install --frozen-lockfile
cd ../
rm -rf ./api_src
yarn cache clean