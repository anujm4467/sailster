import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';

const log = message => Logger.log(message, 'databaseProviders');
const err = error => Logger.error(error.message, null, 'databaseProviders');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true, // Don't build indexes
  reconnectTries: 1, // Never stop trying to reconnect
  reconnectInterval: 5000, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  // connectTimeoutMS: 1000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 60000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const MONGODB_URL = process.env.MONGODB_URL;

const connect = () => {
  log('TRYING TO CONNECT TO MONGODB');

  return mongoose
    .connect(MONGODB_URL, options)
    .catch((error) => {
      err(error);
    });
};

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const db = mongoose.connection;

      db.on('open', (ref) => {
        log('open connection to mongo server.');
      });

      db.on('connected', (ref) => {
        log('connected to mongo server.');
      });

      db.on('disconnected', (ref) => {
        log('disconnected from mongo server.');
        setTimeout(connect, 10000);
      });

      db.on('disconnect', (error) => {
        log(`Error...disconnect ${error}`);
      });

      db.on('connecting', (ref) => {
        log('connecting to mongo server');
      });

      db.on('close', (ref) => {
        log('close mongo server.');
      });

      db.on('error', (ref) => {
        log('error from mongo server');
      });

      db.on('reconnected', () => {
        log('reconnected to mongo server');
      });

      db.on('reconnecting', () => {
        log('reconnecting to mongo server');
      });

      return connect();
    },
  },
];
