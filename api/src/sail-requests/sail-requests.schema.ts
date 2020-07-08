import {
  SailRequestSchema,
  SailRequestSchemaIndex,
  SailRequestVirtuals,
} from '../shared/sail-request/sail-request.schema';
import { schema } from '../utils/schema.util';

export const sailRequestsSchema = schema(SailRequestSchema, SailRequestSchemaIndex, undefined, SailRequestVirtuals);
