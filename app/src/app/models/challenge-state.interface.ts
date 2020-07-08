import { IChallenge } from '../../../../api/src/shared/challenge/challenge.interface';

export interface ChallengeState {
  [propName: string]: IChallenge;
}
