import { ISailRequest } from '../../../../api/src/shared/sail-request/sail-request.interface';

export interface ISailRequestState {
  [propName: string]: ISailRequest;
}

export interface ISailRequestMap {
  [propName: string]: ISailRequest;
}
