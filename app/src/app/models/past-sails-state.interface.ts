import { ISail } from '../../../../api/src/shared/sail/sail.interface';

export interface IPastSailsState {
  [propName: string]: ISail[];
  all: ISail[];
}
