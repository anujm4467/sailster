import { UserSchema, UserSchemaIndex, UserVirtuals } from '../shared/user/user.schema';
import { schema } from '../utils/schema.util';

export const usersSchema = schema(UserSchema, UserSchemaIndex, undefined, UserVirtuals);
