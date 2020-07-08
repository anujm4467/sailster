import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IProfile } from '../shared/profile/profile.interface';

@Injectable()
export class ProfileService extends CrudService<IProfile> {
  constructor(@Inject('PROFILE_MODEL') model: Model<IProfile>) {
    super(model);
  }
}
