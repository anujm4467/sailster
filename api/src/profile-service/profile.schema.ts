import {
  ProfileSchema,
  ProfileSchemaIndex,
} from '../shared/profile/profile.schema';
import { schema } from '../utils/schema.util';

export const profileSchema = schema(ProfileSchema, ProfileSchemaIndex);
