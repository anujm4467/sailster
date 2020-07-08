import { Connection } from 'mongoose';
import { boatsSchema } from './boats.schema';

export const boatsProviders = [
  {
    provide: 'BOAT_MODEL',
    useFactory: (connection: Connection) => connection.model('Boat', boatsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
