import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ISailPictures } from '../shared/sail-pictures/sail-pictures.interface';

@Injectable()
export class SailPicturesService extends CrudService<ISailPictures> {
  constructor(@Inject('SAIL_PICTURES_MODEL') model: Model<ISailPictures>) {
    super(model);
  }
}
