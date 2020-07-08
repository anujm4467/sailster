import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userAccessProviders } from './user-access.providers';
import { UserAccessService } from './user-access.service';

@Module({
  exports: [
    ...userAccessProviders,
    UserAccessService,
  ],
  imports: [
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    ...userAccessProviders,
    UserAccessService,
  ],
})
export class UserAccessServiceModule {}
