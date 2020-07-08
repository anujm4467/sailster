import { HULL_PROPS } from './hull.interface';

export interface IHullSchema {
  [HULL_PROPS.BEAM]: StringConstructor;
  [HULL_PROPS.CONSTRUCTION]: StringConstructor;
  [HULL_PROPS.DRAFT]: StringConstructor;
  [HULL_PROPS.HULL_TYPE]: StringConstructor;
  [HULL_PROPS.LOA]: StringConstructor;
  [HULL_PROPS.LWL]: StringConstructor;
}

export const HullSchema: IHullSchema = {
  [HULL_PROPS.BEAM]: String,
  [HULL_PROPS.CONSTRUCTION]: String,
  [HULL_PROPS.DRAFT]: String,
  [HULL_PROPS.HULL_TYPE]: String,
  [HULL_PROPS.LOA]: String,
  [HULL_PROPS.LWL]: String,
};
