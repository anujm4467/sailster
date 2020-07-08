import { schema } from '../utils/schema.util';
import {
  RequiredActionSchema,
  RequiredActionSchemaIndex,
} from '../shared/required-action/required-action.schema';

export const requiredActionsSchema = schema(RequiredActionSchema, RequiredActionSchemaIndex);
