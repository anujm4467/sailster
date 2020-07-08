import {
  ClinicSchema,
  ClinicSchemaIndex,
} from '../shared/clinic/clinic.schema';
import { schema } from '../utils/schema.util';

export const clinicsSchema = schema(ClinicSchema, ClinicSchemaIndex);
