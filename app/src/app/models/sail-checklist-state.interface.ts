import { ISailChecklist } from '../../../../api/src/shared/sail-checklist/sail-checklist.interface';

export interface ISailChecklistState {
  search: ISailChecklist[];
  all: ISailChecklistMap;
}

export interface ISailChecklistMap {
  [propName: string]: ISailChecklist;
}
