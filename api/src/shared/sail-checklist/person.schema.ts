import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { PERSON_PROPS } from './person.interface';

export interface IPersonSchema {
  [PERSON_PROPS.GUEST_OF]: StringConstructor;
  [PERSON_PROPS.NAME]: StringConstructor;
  [PERSON_PROPS.PERSON_TYPE]: { type: StringConstructor; enum: PERSON_PROPS[]; };
  [PERSON_PROPS.PRESENT]: BooleanConstructor;
  [PERSON_PROPS.PROFILE]: { type: any; ref: DB_MODELS; };
}

export const PersonSchema: IPersonSchema = {
  [PERSON_PROPS.GUEST_OF]: String,
  [PERSON_PROPS.NAME]: String,
  [PERSON_PROPS.PERSON_TYPE]: { type: String, enum: Object.values(PERSON_PROPS) },
  [PERSON_PROPS.PRESENT]: Boolean,
  [PERSON_PROPS.PROFILE]: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
};
