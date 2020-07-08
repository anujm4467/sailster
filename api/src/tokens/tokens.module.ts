import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { tokensProviders } from './tokens.providers';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
  ],
  exports: [
    TokensService,
    ...tokensProviders,
  ],
  providers: [
    TokensService,
    ...tokensProviders,
  ],
})
export class TokensModule { }
