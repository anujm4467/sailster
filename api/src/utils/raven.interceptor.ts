import { RavenInterceptor } from 'nest-raven';
import {
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';

export class MyRavenInterceptor extends RavenInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return super.intercept(context, next);
  }
}
