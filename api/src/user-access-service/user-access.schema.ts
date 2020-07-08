import {
  UserAccessSchema,
  UserAccessSchemaIndex,
} from '../shared/user-access/user-access.schema';
import { schema } from '../utils/schema.util';

export const userAccessSchema = schema(UserAccessSchema, UserAccessSchemaIndex);
