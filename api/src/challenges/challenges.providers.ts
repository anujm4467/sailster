import { Connection } from 'mongoose';
import { challengesSchema } from './challenges.schema';

export const challengesProviders = [
  {
    provide: 'CHALLENGE_MODEL',
    useFactory: (connection: Connection) => connection.model('Challenge', challengesSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
