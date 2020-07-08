import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    /* do not expose the controller unless there is a use for it */
  ],
  exports: [
    UsersService,
    ...usersProviders,
  ],
  providers: [
    UsersService,
    ...usersProviders,
  ],
})
export class UsersModule { }
