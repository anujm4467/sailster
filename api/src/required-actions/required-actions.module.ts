import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RequiredActionsController } from './required-actions.controller';
import { requiredActionsProviders } from './required-actions.providers';
import { RequiredActionsService } from './required-actions.service';

@Module({
  controllers: [
    RequiredActionsController,
  ],
  exports: [
    RequiredActionsService,
  ],
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  providers: [
    RequiredActionsService,
    ...requiredActionsProviders,
  ],
})
export class RequiredActionsModule { }
