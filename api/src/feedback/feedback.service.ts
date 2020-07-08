import { Model } from 'mongoose';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { IFeedback } from '../shared/feedback/feedback.interface';

@Injectable()
export class FeedbackService extends CrudService<IFeedback> {
  constructor(@Inject('FEEDBACK_MODEL') model: Model<IFeedback>) {
    super(model);
  }
}
