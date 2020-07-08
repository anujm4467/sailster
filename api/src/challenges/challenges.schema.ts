import {
  ChallengeSchema,
  ChallengeSchemaIndex,
} from '../shared/challenge/challenge.schema';
import { schema } from '../utils/schema.util';

export const challengesSchema = schema(ChallengeSchema, ChallengeSchemaIndex);
