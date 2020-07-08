import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { BoatMaintenanceController } from './boat-maintenance.controller';
import { boatMaintenanceProviders } from './boat-maintenance.providers';
import { BoatMaintenanceService } from './boat-maintenance.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    EmailModule,
  ],
  controllers: [
    BoatMaintenanceController,
  ],
  providers: [
    BoatMaintenanceService,
    ...boatMaintenanceProviders,
  ],
})
export class BoatMaintenanceModule {}
