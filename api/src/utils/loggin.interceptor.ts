import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LogsService) private logService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getRequest().logService = this.logService;
    return next.handle();
  }
}
