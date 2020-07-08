import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SailPathsController } from './sail-paths.controller';
import { sailPathsProviders } from './sail-paths.providers';
import { SailPathsService } from './sail-paths.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  controllers: [
    SailPathsController,
  ],
  providers: [
    SailPathsService,
    ...sailPathsProviders,
  ],
})
export class SailPathsModule {}
