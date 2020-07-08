import {
  HistorySchema,
  HistorySchemaIndex,
} from '../shared/history/history.schema';
import { schema } from '../utils/schema.util';

export const historySchema = schema(HistorySchema, HistorySchemaIndex);
