import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IBoat } from '../shared/boat/boat.interface';

@Injectable()
export class BoatsService extends CrudService<IBoat> {
  constructor(@Inject('BOAT_MODEL') model: Model<IBoat>) {
    super(model);
  }
}
