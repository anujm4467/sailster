import { IRequiredAction } from '../../../../api/src/shared/required-action/required-action.interface';

export interface RequiredActions {
  [propName: string]: IRequiredAction;
}

export interface RequiredActionsFetching {
  [propName: string]: boolean;
}

export interface RequiredActionsState {
  fetching: RequiredActions;
  actions: RequiredActions;
}
