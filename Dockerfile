FROM node:12.13.0-alpine
COPY ./app/app /app
COPY ./api/api /api
COPY ./docs /docs
COPY ./start-servers.sh ./start-servers.sh
CMD ["./start-servers.sh"]