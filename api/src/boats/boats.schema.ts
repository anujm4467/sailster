import {
  BoatSchema,
  BoatSchemaIndex,
} from '../shared/boat/boat.schema';
import { schema } from '../utils/schema.util';

export const boatsSchema = schema(BoatSchema, BoatSchemaIndex);
