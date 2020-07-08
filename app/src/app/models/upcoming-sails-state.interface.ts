import { ISail } from '../../../../api/src/shared/sail/sail.interface';

export interface IUpcomingSailsState {
  [propName: string]: ISail[];
  all: ISail[];
}
