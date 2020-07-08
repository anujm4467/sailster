import * as mongoose from 'mongoose';
import { DB_MODELS } from '../db-models.enum';
import { ChecklistSchema } from './checklist.schema';
import { PersonSchema } from './person.schema';

// tslint:disable-next-line: variable-name
export const SailChecklistSchema = {
  after: ChecklistSchema,
  before: ChecklistSchema,
  boat: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.BOAT },
  peopleManifest: [PersonSchema],
  sail: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.SAIL },
  sailDestination: String,
  sailEnd: Date,
  sailStart: Date,
  weather: String,
};

// tslint:disable-next-line: variable-name
export const SISailChecklist = [
  {
    fields: {
      boat: -1,
      sail: -1,
      sailStart: -1,
      sailEnd: -1,
    },
    options: {
      unique: true,
    },
  },
];
