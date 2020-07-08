import { SBoatMaintenance, SIBoatMaintenance, MaintenanceVirtuals } from '../shared/maintenance/maintenance.schema';
import { schema } from '../utils/schema.util';

export const boatMaintenanceSchema = schema(SBoatMaintenance, SIBoatMaintenance, undefined, MaintenanceVirtuals);
