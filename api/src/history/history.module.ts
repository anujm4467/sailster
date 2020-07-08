import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { HistoryController } from './history.controller';
import { historyProviders } from './history.providers';
import { HistoryService } from './history.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  controllers: [
    HistoryController,
  ],
  providers: [
    HistoryService,
    ...historyProviders,
  ],
  exports: [
    HistoryService,
    ...historyProviders,
  ],
})
export class HistoryModule { }
