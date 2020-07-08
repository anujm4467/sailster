import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { ISailRequest } from '../shared/sail-request/sail-request.interface';

@Injectable()
export class SailRequestsService extends CrudService<ISailRequest> {
  constructor(@Inject('SAIL_REQUEST_MODEL') model: Model<ISailRequest>) {
    super(model);
  }
}
