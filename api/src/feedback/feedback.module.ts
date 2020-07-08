import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { FeedbackController } from './feedback.controller';
import { feedbackProviders } from './feedback.providers';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  controllers: [
    FeedbackController,
  ],
  providers: [
    FeedbackService,
    ...feedbackProviders,
  ],
})
export class FeedbackModule {}
