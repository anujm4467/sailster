import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { ProfileServiceModule } from '../profile-service/profile-service.module';
import { RequiredActionsModule } from '../required-actions/required-actions.module';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    EmailModule,
    ProfileServiceModule,
    RequiredActionsModule,
  ],
  controllers: [
    ProfilesController,
  ],
})
export class ProfilesModule {}
