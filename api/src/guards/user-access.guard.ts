import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../shared/token/jwt-object.interface';

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const handler = context.getHandler();
    const requiredAccess = this.reflector.get<string[]>('access', handler);

    if (!requiredAccess) {
      return true;
    }

    const userAccess = (user.access || {}).access || {};
    const can = !!userAccess[requiredAccess[0]];

    return can;
  }
}
