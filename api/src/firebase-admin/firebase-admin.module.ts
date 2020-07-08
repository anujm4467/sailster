import { AuthModule } from '../auth/auth.module';
import { FirebaseAdminController } from './firebase-admin.controller';
import { FirebaseAdminService } from './firebase-admin.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    FirebaseAdminController,
  ],
  providers: [
    FirebaseAdminService,
  ],
})
export class FirebaseAdminModule {}
