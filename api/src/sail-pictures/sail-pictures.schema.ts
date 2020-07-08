import {
  SailPicturesSchema,
  SailPicturesSchemaIndex,
} from '../shared/sail-pictures/sail-picture.schema';
import { schema } from '../utils/schema.util';

export const sailPicturesSchema = schema(SailPicturesSchema, SailPicturesSchemaIndex);
