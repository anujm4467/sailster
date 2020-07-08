import { Connection } from 'mongoose';
import { clinicsSchema } from './clinics.schema';

export const clinicsProviders = [
  {
    provide: 'CLINIC_MODEL',
    useFactory: (connection: Connection) => connection.model('Clinic', clinicsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
