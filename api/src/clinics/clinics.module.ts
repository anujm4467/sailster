import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ProfileServiceModule } from '../profile-service/profile-service.module';
import { ClinicsController } from './clinics.controller';
import { clinicsProviders } from './clinics.providers';
import { ClinicsService } from './clinics.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ProfileServiceModule,
  ],
  controllers: [
    ClinicsController,
  ],
  providers: [
    ...clinicsProviders,
    ClinicsService,
  ],
})
export class ClinicsModule {}
