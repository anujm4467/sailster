import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IChallenge } from '../shared/challenge/challenge.interface';

@Injectable()
export class ChallengesService extends CrudService<IChallenge> {
  constructor(@Inject('CHALLENGE_MODEL') model: Model<IChallenge>) {
    super(model);
  }
}
