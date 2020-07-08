export enum HULL_PROPS {
  BEAM = 'beam',
  CONSTRUCTION = 'construction',
  DRAFT = 'draft',
  HULL_TYPE = 'hullType',
  LOA = 'loa',
  LWL = 'lwl',
}
export interface IHull {
  [HULL_PROPS.BEAM]?:	string;
  [HULL_PROPS.CONSTRUCTION]?: string;
  [HULL_PROPS.DRAFT]?: string;
  [HULL_PROPS.HULL_TYPE]?: string;
  [HULL_PROPS.LOA]?: string;
  [HULL_PROPS.LWL]?: string;
}
