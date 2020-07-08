import {
  SailChecklistSchema,
  SISailChecklist,
} from '../shared/sail-checklist/sail-checklist.schema';
import { schema } from '../utils/schema.util';

export const sailChecklistsSchema = schema(SailChecklistSchema, SISailChecklist);
