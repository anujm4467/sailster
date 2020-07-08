import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { InstructionsModule } from '../instructions/instructions.module';
import { BoatsController } from './boats.controller';
import { boatsProviders } from './boats.providers';
import { BoatsService } from './boats.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    InstructionsModule,
  ],
  exports: [
    BoatsService,
  ],
  controllers: [
    BoatsController,
  ],
  providers: [
    BoatsService,
    ...boatsProviders,
  ],
})
export class BoatsModule { }
