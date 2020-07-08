import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SailRequestsController } from './sail-requests.controller';
import { sailRequestsProviders } from './sail-requests.providers';
import { SailRequestsService } from './sail-requests.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    DatabaseModule,
  ],
  controllers: [
    SailRequestsController,
  ],
  providers: [
    ...sailRequestsProviders,
    SailRequestsService,
  ],
})
export class SailRequestsModule {}
