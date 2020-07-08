import { Connection } from 'mongoose';
import { sailPathsSchema } from './sail-paths.schema';

export const sailPathsProviders = [
  {
    provide: 'SAIL_PATH_MODEL',
    useFactory: (connection: Connection) => connection.model('SailPath', sailPathsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
