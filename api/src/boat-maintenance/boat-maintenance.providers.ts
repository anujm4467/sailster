import { Connection } from 'mongoose';
import { boatMaintenanceSchema } from './boat-maintenance.schema';

export const boatMaintenanceProviders = [
  {
    provide: 'BOAT_MAINTENANCE_MODEL',
    useFactory: (connection: Connection) => connection
      .model('BoatMaintenance', boatMaintenanceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
