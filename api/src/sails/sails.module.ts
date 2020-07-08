import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BoatsModule } from '../boats/boats.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { HistoryModule } from '../history/history.module';
import { ProfileServiceModule } from '../profile-service/profile-service.module';
import { RequiredActionsModule } from '../required-actions/required-actions.module';
import { SailChecklistsModule } from '../sail-checklists/sail-checklists.module';
import { SailsController } from './sails.controller';
import { sailsProviders } from './sails.providers';
import { SailsService } from './sails.service';

@Module({
  imports: [
    AuthModule,
    BoatsModule,
    DatabaseModule,
    EmailModule,
    HistoryModule,
    ProfileServiceModule,
    RequiredActionsModule,
    SailChecklistsModule,
  ],
  controllers: [
    SailsController,
  ],
  providers: [
    ...sailsProviders,
    SailsService,
  ],
})
export class SailsModule {}
