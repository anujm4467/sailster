import * as mongoose from 'mongoose';
import { TOKEN_MODEL_PROPS } from './token-model.interface';

export const TokenModelSchema = {
  [TOKEN_MODEL_PROPS.TOKEN]: String,
  [TOKEN_MODEL_PROPS.PROFILE_ID]: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  [TOKEN_MODEL_PROPS.PROVIDER]: String,
  [TOKEN_MODEL_PROPS.EXPIRE_AT]: Date,
};

export const TokenModelSchemaIndex = [
  {
    fields: {
      [TOKEN_MODEL_PROPS.EXPIRE_AT]: 1,
    },
    options: {
      unique: false,
      expireAfterSeconds: 0,
    },
  },
];
