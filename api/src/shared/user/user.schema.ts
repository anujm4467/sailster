import * as mongoose from 'mongoose';

// Virtuals
// tslint:disable-next-line: variable-name
export const UserVirtuals = [
  {
    name: 'resolvedProfile',
    model: {
      ref: 'Profile',
      localField: 'profileId',
      foreignField: '_id',
      justOne: true,
    },
  },
];

// tslint:disable-next-line: variable-name
export const UserSchema = {
  uid: String,
  provider: String,
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
};

// tslint:disable-next-line: variable-name
export const UserSchemaIndex = [
  {
    fields: {
      uid: 1,
    },
    options: {
      unique: true,
    },
  },
];
