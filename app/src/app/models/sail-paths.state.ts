import { ISailPath } from '../../../../api/src/shared/sail-path/sail-path.interface';

export interface SailPaths {
  [propName: string]: ISailPath;
}

export interface SailPathFetching {
  [propName: string]: boolean;
}

export interface SailPathsState {
  fetching: SailPathFetching;
  sailPaths: SailPaths;
}
