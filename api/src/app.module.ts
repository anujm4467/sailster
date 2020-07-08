import {
  MorganInterceptor,
  MorganModule,
} from 'nest-morgan';
import { RavenModule } from 'nest-raven';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BoatMaintenanceModule } from './boat-maintenance/boat-maintenance.module';
import { BoatsModule } from './boats/boats.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ClinicsModule } from './clinics/clinics.module';
import { EmailModule } from './email/email.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { HistoryModule } from './history/history.module';
import { InstructionsModule } from './instructions/instructions.module';
import { LogsModule } from './logs/logs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RequiredActionsModule } from './required-actions/required-actions.module';
import { SailChecklistsModule } from './sail-checklists/sail-checklists.module';
import { SailPicturesModule } from './sail-pictures/sail-picturess.module';
import { SailRequestsModule } from './sail-requests/sail-requests.module';
import { SailPathsModule } from './sails-paths/sail-paths.module';
import { SailsModule } from './sails/sails.module';
import { TokensModule } from './tokens/tokens.module';
import { UserAccessModule } from './user-access/user-access.module';
import { UsersModule } from './users/users.module';
import { LoggingInterceptor } from './utils/loggin.interceptor';
import { morgan } from './utils/morgan.util';
import { MyRavenInterceptor } from './utils/raven.interceptor';

@Module({
  imports: [
    AuthModule,
    BoatMaintenanceModule,
    BoatsModule,
    ChallengesModule,
    ClinicsModule,
    EmailModule,
    FeedbackModule,
    FirebaseAdminModule,
    HistoryModule,
    InstructionsModule,
    LogsModule,
    MorganModule.forRoot(),
    ProfilesModule,
    RavenModule,
    RequiredActionsModule,
    SailChecklistsModule,
    SailPathsModule,
    SailPicturesModule,
    SailRequestsModule,
    SailsModule,
    TokensModule,
    UserAccessModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new MyRavenInterceptor(),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor(morgan),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
