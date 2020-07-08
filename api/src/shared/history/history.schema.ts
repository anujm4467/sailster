import * as mongoose from 'mongoose';

// Schema
// tslint:disable-next-line: variable-name
export const HistorySchema = {
  byId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  byName: String,
  data: String,
  forId: mongoose.Schema.Types.ObjectId,
  forName: String,
  event: String,
  createdOn: Date,
  updatedOn: Date,
};

// Schema Index
// tslint:disable-next-line: variable-name
export const HistorySchemaIndex = [
  {
    fields: {
      byId: -1,
    },
  },
  {
    fields: {
      forId: -1,
    },
  },
  {
    fields: {
      createdOn: -1,
    },
  },
];
