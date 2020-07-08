import {
  CommentSchema,
  ICommentSchema,
} from '../comment/comment.schema';
import {
  IMediaSchema,
  MediaSchema,
} from '../media/media.schema';
import {
  CHALLENGE_PROPS,
  CHALLENGE_STATUS,
} from './challenge.interface';

export interface IChallengerSchema {
  profile: StringConstructor;
  completedOn: DateConstructor;
}

export const ChallengerSchema: IChallengerSchema = {
  profile: String,
  completedOn: Date,
};

export interface IChallengeSchema {
  [CHALLENGE_PROPS.COMMENTS]: ICommentSchema[];
  [CHALLENGE_PROPS.COMPLETED_BY]: IChallengerSchema[];
  [CHALLENGE_PROPS.DESCRIPTION]: {
    type: StringConstructor;
    required: boolean;
  };
  [CHALLENGE_PROPS.DUE_DATE]: {
    type: DateConstructor;
    required: boolean;
  };
  [CHALLENGE_PROPS.PICTURES]: IMediaSchema[];
  [CHALLENGE_PROPS.TITLE]: {
    type: StringConstructor;
    required: boolean;
  };
  [CHALLENGE_PROPS.STATUS]: {
    type: StringConstructor;
    required: boolean;
    enum: CHALLENGE_STATUS[];
    default: CHALLENGE_STATUS;
  };
}

export const ChallengeSchema: IChallengeSchema = {
  [CHALLENGE_PROPS.COMMENTS]: [CommentSchema],
  [CHALLENGE_PROPS.COMPLETED_BY]: [ChallengerSchema],
  [CHALLENGE_PROPS.DESCRIPTION]: {
    type: String,
    required: true,
  },
  [CHALLENGE_PROPS.DUE_DATE]: {
    type: Date,
    required: true,
  },
  [CHALLENGE_PROPS.PICTURES]: [MediaSchema],
  [CHALLENGE_PROPS.STATUS]: {
    type: String,
    required: true,
    enum: Object.values(CHALLENGE_STATUS),
    default: CHALLENGE_STATUS.ACTIVE,
  },
  [CHALLENGE_PROPS.TITLE]: {
    type: String,
    required: true,
  },
};

export const ChallengeSchemaIndex = [
  {
    fields: {
      [CHALLENGE_PROPS.STATUS]: -1,
    },
    options: {
      unique: false,
    },
  },
  {
    fields: {
      [CHALLENGE_PROPS.DUE_DATE]: -1,
    },
    options: {
      unique: false,
    },
  },
];
