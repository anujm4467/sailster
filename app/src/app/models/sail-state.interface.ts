import { ISail } from '../../../../api/src/shared/sail/sail.interface';

export interface ISailState {
  search: ISail[];
  all: ISailMap;
}

export interface ISailMap {
  [propName: string]: ISail;
}
