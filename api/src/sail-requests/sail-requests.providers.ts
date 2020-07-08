import { Connection } from 'mongoose';
import { sailRequestsSchema } from './sail-requests.schema';

export const sailRequestsProviders = [
  {
    provide: 'SAIL_REQUEST_MODEL',
    useFactory: (connection: Connection) => connection.model('SailRequest', sailRequestsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
