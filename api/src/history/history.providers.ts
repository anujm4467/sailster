import { Connection } from 'mongoose';
import { historySchema } from './history.schema';

export const historyProviders = [
  {
    provide: 'HISTORY_MODEL',
    useFactory: (connection: Connection) => connection.model('History', historySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
