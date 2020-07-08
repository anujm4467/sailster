import {
  LogSchema,
  LogSchemaIndex,
  LogSchemaOptions,
} from '../shared/log/log.schema';
import { schema } from '../utils/schema.util';

export const logsSchema = schema(LogSchema, LogSchemaIndex, LogSchemaOptions);
