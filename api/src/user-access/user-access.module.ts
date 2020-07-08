import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UserAccessController } from './user-access.controller';
import { UserAccessServiceModule } from '../user-access-service/user-access-service.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserAccessServiceModule,
  ],
  controllers: [
    UserAccessController,
  ],
})
export class UserAccessModule {}
