import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../shared/token/jwt-object.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const handler = context.getHandler();
    const requiredRoles = this.reflector.get<string[]>('roles', handler);

    if (!requiredRoles) {
      return true;
    }

    const userRoles = user.roles || [];
    const can = userRoles.some(role => requiredRoles.includes(role));

    return can;
  }
}
