import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SailPicturesController } from './sail-pictures.controller';
import { sailPicturesProviders } from './sail-pictures.providers';
import { SailPicturesService } from './sail-pictures.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
  ],
  controllers: [
    SailPicturesController,
  ],
  providers: [
    ...sailPicturesProviders,
    SailPicturesService,
  ],
})
export class SailPicturesModule {}
