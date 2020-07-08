import { Connection } from 'mongoose';
import { profileSchema } from './profile.schema';

export const profileProviders = [
  {
    provide: 'PROFILE_MODEL',
    useFactory: (connection: Connection) => connection.model('Profile', profileSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
