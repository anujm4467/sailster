import { IChecklist } from './checklist.interface';
import { IPerson } from './person.interface';

export interface ISailChecklist {
  after?: IChecklist;
  before?: IChecklist;
  boat?: string;
  id?: string;
  peopleManifest?: IPerson[];
  sail?: string;
  sailDestination?: string;
  sailEnd?: Date | string;
  sailStart?: Date | string;
  weather?: string;
}
