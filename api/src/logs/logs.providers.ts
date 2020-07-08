import { Connection } from 'mongoose';
import { logsSchema } from './logs.schema';

export const logsProviders = [
  {
    provide: 'LOG_MODEL',
    useFactory: (connection: Connection) => connection.model('Log', logsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
