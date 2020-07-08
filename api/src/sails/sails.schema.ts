import {
  SailSchema,
  SailSchemaIndex,
  SailVirtuals,
} from '../shared/sail/sail.schema';
import { schema } from '../utils/schema.util';

export const sailsSchema = schema(SailSchema, SailSchemaIndex, undefined, SailVirtuals);
