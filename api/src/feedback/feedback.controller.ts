import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IFeedback } from '../shared/feedback/feedback.interface';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class FeedbackController extends CrudController<IFeedback> {
  constructor(service: FeedbackService) {
    super(service);
  }
}
