node --version

echo "ls"
ls

echo "ls api"
ls api

echo "ls app"
ls app

node ./api/main.js&
node ./app/server/server.js