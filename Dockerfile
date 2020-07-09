FROM node:12.13.0-alpine
WORKDIR /app_root
COPY . .
RUN chmod +x ./build-docker.sh && chmod +x ./start-servers.sh && ./build-docker.sh && rm -rf ./build-docker.sh
CMD ["./start-servers.sh"]