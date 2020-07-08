import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { USER_ACCESS_FIELDS } from './user-access.interface';

export interface IAccessSchema {
  [propName: string]: BooleanConstructor;

}
export const AccessSchema: IAccessSchema = Object
  .values(USER_ACCESS_FIELDS)
  .reduce(
    (red, key) => {
      red[key] = Boolean;
      return red;
    },
    {},
  );

export const UserAccessSchema = {
  _id: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.PROFILE },
  access: AccessSchema,
};

export const UserAccessSchemaIndex = [];
