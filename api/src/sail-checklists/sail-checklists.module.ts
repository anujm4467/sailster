import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { HistoryModule } from '../history/history.module';
import { Module } from '@nestjs/common';
import { SailChecklistsController } from './sail-checklists.controller';
import { sailChecklistsProviders } from './sail-checklists.provider';
import { SailChecklistsService } from './sail-checklists.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    HistoryModule,
  ],
  controllers: [
    SailChecklistsController,
  ],
  providers: [
    SailChecklistsService,
    ...sailChecklistsProviders,
  ],
  exports: [
    SailChecklistsService,
    ...sailChecklistsProviders,
  ],
})
export class SailChecklistsModule { }
