import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { InstructionsController } from './instructions.controller';
import { instructionsProviders } from './instructions.providers';
import { InstructionsService } from './instructions.service';

@Module({
  exports: [
    ...instructionsProviders,
    InstructionsService,
  ],
  imports: [
    AuthModule,
    DatabaseModule,
    EmailModule,
  ],
  controllers: [
    InstructionsController,
  ],
  providers: [
    ...instructionsProviders,
    InstructionsService,
  ],
})
export class InstructionsModule {}
