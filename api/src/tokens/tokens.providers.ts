import { Connection } from 'mongoose';
import { tokensSchema } from './tokens.schema';

export const tokensProviders = [
  {
    provide: 'TOKEN_MODEL',
    useFactory: (connection: Connection) => connection.model('Token', tokensSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
