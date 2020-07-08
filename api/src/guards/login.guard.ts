import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtObject } from '../shared/token/jwt-object.interface';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const profileId = user.profileId;

    const cachedToken = this.authService.getCachedToken(profileId);

    if (cachedToken) {
      return cachedToken.expireAt.getTime() > Date.now();
    }

    const storedToken = await this.authService.getStoredToken(profileId);

    if (storedToken) {
      return storedToken.expireAt.getTime() > Date.now();
    }

    return false;
  }
}
