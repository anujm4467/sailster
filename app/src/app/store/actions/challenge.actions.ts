import {
  createAction,
  props,
} from '@ngrx/store';
import {
  IChallenge,
  IChallenger,
} from '../../../../../api/src/shared/challenge/challenge.interface';
import { IComment } from '../../../../../api/src/shared/comment/comment.interface';
import { IMedia } from '../../../../../api/src/shared/media/media.interface';

export enum CHALLENGE_ACTION_TYPES {
  COMPLETE_USER_CHALLENGE = '[Challenge] Complete user challenge',
  CREATE_CHALLENGE = '[Challenge] Create challenge',
  DELETE_PICTURE = '[Challenge] Delete challenge picture',
  FETCH_CHALLENGE = '[Challenge] Fetch challenge',
  FETCH_CHALLENGES = '[Challenge] Fetch challenges',
  POST_COMMENT = '[Challenge] Post challenge comment',
  POST_PICTURES = '[Challenge] Post challenge pictures',
  PUT_CHALLENGE = '[Challenge] Put challenge',
  PUT_CHALLENGES = '[Challenge] Put challenges',
  RESET = 'Reset',
  UPDATE_CHALLENGE = '[Challenge] Update challenge',
}

export const completeUserChallenge = createAction(
  CHALLENGE_ACTION_TYPES.COMPLETE_USER_CHALLENGE, props<{ challengeId: string, challenger: IChallenger, notify?: boolean }>());
export const createChallenge = createAction(CHALLENGE_ACTION_TYPES.CREATE_CHALLENGE, props<{ challenge: IChallenge, notify?: boolean }>());
export const fetchChallenge = createAction(CHALLENGE_ACTION_TYPES.FETCH_CHALLENGE, props<{ challengeId: string, notify?: boolean }>());
export const fetchChallenges = createAction(CHALLENGE_ACTION_TYPES.FETCH_CHALLENGES, props<{ query?: string, notify?: boolean }>());
export const putChallenge = createAction(CHALLENGE_ACTION_TYPES.PUT_CHALLENGE, props<{ challengeId: string, challenge: IChallenge }>());
export const putChallenges = createAction(CHALLENGE_ACTION_TYPES.PUT_CHALLENGES, props<{ challenges: IChallenge[] }>());
export const resetChallenges = createAction(CHALLENGE_ACTION_TYPES.RESET);
export const updateChallenge = createAction(
  CHALLENGE_ACTION_TYPES.UPDATE_CHALLENGE, props<{ challengeId: string, challenge: IChallenge, notify?: boolean }>());
export const postChallengePictures = createAction(
  CHALLENGE_ACTION_TYPES.POST_PICTURES, props<{ challengeId: string, pictures: IMedia[], notify?: boolean }>());
export const deleteChallengePicture = createAction(
  CHALLENGE_ACTION_TYPES.DELETE_PICTURE, props<{ challengeId: string, pictureId: string, notify?: boolean }>());
export const postChallengeComment = createAction(
  CHALLENGE_ACTION_TYPES.POST_COMMENT, props<{ challengeId: string, comment: IComment, notify?: boolean }>());
