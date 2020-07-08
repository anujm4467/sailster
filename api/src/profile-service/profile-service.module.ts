import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { profileProviders } from './profile.providers';
import { ProfileService } from './profile.service';

@Module({
  exports: [
    ...profileProviders,
    ProfileService,
  ],
  imports: [
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    ...profileProviders,
    ProfileService,
  ],
})
export class ProfileServiceModule {}
