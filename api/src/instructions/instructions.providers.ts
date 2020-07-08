import { Connection } from 'mongoose';
import { instructionsSchema } from './instructions.schema';

export const instructionsProviders = [
  {
    provide: 'INSTRUCTIONS_MODEL',
    useFactory: (connection: Connection) => connection.model('Instructions', instructionsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
