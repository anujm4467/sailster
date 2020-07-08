import {
  SailPathSchema,
  SailPathSchemaIndex,
} from '../shared/sail-path/sail-path.schema';
import { schema } from '../utils/schema.util';

export const sailPathsSchema = schema(SailPathSchema, SailPathSchemaIndex);
