import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { LogsController } from './logs.controller';
import { logsProviders } from './logs.providers';
import { LogsService } from './logs.service';

@Module({
  controllers: [
    LogsController,
  ],
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  providers: [
    LogsService,
    ...logsProviders,
  ],
  exports: [
    LogsService,
    ...logsProviders,
  ],
})
export class LogsModule { }
