# Sailster API

A [NestJs](https://nestjs.com/) project.

Authorization: [PassportJs with Google](http://www.passportjs.org/docs/google/)  
File storage: [Firebase Storage](https://firebase.google.com/docs/storage/)  
Database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
EMail: [Mail Gun](https://www.mailgun.com)  
Error tracking: [Sentry.io](https://sentry.io/)  

# Deployment

## Production

http://app.blindsialing.ca/docs/api

# Local Setup

## Installation

`yarn install`

## Firebase project

1. Create your own [Firebase](https://firebase.google.com/) project.
1. Set up [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin/node)
1. Configure Google OAuth 2.0 Client IDs `https://console.developers.google.com/apis/credentials?project=<your firebase project name>`
1. Generate and save firebase sdk configuration file `https://console.firebase.google.com/project/<your-project>/settings/serviceaccounts/adminsdk`

## .env

Create `.env` file in `./api`.  

This file contains all the configuration variables.

***WARNING*** DO NOT COMMIT THIS FILE TO YOUR REPO.

Content of `.env`  
```
DOMAIN=http://localhost:4200
FIREBASE_ADMIN_SDK_ACCOUNT_FILE=<path to firebase admin sdk account config file>
FIREBASE_DATABASE_URL=<url of your project firebase db>
FIREBASE_STORAGE_BUCKET=<url of your firebase project storage bucket>
GOOGLE_CALLBACK_URL=http://localhost:4200/api/auth/google/callback
GOOGLE_CLIENT_ID=<your google auth client id>
GOOGLE_CLIENT_SECRET=<your google auth client secret>
JWT_EXPIRES_IN=3600
JWT_SECRET=YOUR_JWT_SECRET_TOKEN
MAIL_GUN_API_KEY=<your mail gun api key>
MAIL_GUN_DOMAIN=<your mail gun domain>
SENTRY_DSN=<your sentry DSN>
MONGODB_URL=<your mongodb connection string>
ADMIN_EMAIL=<your email address>
```

## Start server
`yarn start` start server without hot-reloading  
`yarn start:dev` start server with hot-reloading  
`yarn start:debug` start server with debugging  

See `package.json` scripts section for more commands.
