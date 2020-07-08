import { Connection } from 'mongoose';
import { sailsSchema } from './sails.schema';

export const sailsProviders = [
  {
    provide: 'SAIL_MODEL',
    useFactory: (connection: Connection) => connection.model('Sail', sailsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
