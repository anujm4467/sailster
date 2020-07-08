import { Connection } from 'mongoose';
import { requiredActionsSchema } from './required-actions.schema';

export const requiredActionsProviders = [
  {
    provide: 'REQUIRED_ACTION_MODEL',
    useFactory: (connection: Connection) => connection.model('RequiredAction', requiredActionsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
