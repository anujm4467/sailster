import {
  TokenModelSchema,
  TokenModelSchemaIndex,
} from '../shared/token/token-model.schema';
import { schema } from '../utils/schema.util';

export const tokensSchema = schema(TokenModelSchema, TokenModelSchemaIndex);
