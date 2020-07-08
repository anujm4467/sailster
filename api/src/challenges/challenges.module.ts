import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ChallengesController } from './challenges.controller';
import { challengesProviders } from './challenges.providers';
import { ChallengesService } from './challenges.service';

@Module({
  controllers: [
    ChallengesController,
  ],
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  providers: [
    ChallengesService,
    ...challengesProviders,
  ],
  exports: [
    ChallengesService,
    ...challengesProviders,
  ],
})
export class ChallengesModule { }
