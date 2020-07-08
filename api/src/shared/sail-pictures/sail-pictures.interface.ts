import {
  IMedia,
  IMediaResolved,
} from '../media/media.interface';
import { ISail } from '../sail/sail.interface';

export enum SAIL_PICTURES_PROPS {
  ID = 'id',
  PICTURES = 'pictures',
  SAIL = 'sail',
}

export interface ISailPictures {
  [SAIL_PICTURES_PROPS.ID]?: string;
  [SAIL_PICTURES_PROPS.PICTURES]?: IMedia[];
  [SAIL_PICTURES_PROPS.SAIL]?: string;
}

export interface ISailPicturesResolved {
  [SAIL_PICTURES_PROPS.ID]?: string;
  [SAIL_PICTURES_PROPS.PICTURES]?: IMediaResolved[];
  [SAIL_PICTURES_PROPS.SAIL]?: ISail;
}
