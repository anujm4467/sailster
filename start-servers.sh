node --version

echo "ls"
ls

echo "ls api"
ls api

echo "ls app"
ls app

echo "SENTRY_DSN: ${SENTRY_DSN}"

sed -i "s/SENTRY_DSN/${SENTRY_DSN}/g" ./app/*.js
sed -i "s/SENTRY_DSN/${SENTRY_DSN}/g" ./app/*.js.map

node ./api/main.js&
node ./app/server/server.js