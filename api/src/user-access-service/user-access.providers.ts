import { Connection } from 'mongoose';
import { userAccessSchema } from './user-access.schema';

export const userAccessProviders = [
  {
    provide: 'USER_ACCESS_MODEL',
    useFactory: (connection: Connection) => connection.model('UserAccess', userAccessSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
