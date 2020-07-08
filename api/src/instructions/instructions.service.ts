import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IInstructions } from '../shared/instructions/instructions.interface';

@Injectable()
export class InstructionsService extends CrudService<IInstructions> {
  constructor(@Inject('INSTRUCTIONS_MODEL') model: Model<IInstructions>) {
    super(model);
  }
}
