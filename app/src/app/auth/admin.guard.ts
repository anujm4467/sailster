import { take } from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { PROFILE_ROLES } from '../../../../api/src/shared/profile/profile-roles.enum';
import { PROFILE_STATUS } from '../../../../api/src/shared/profile/profile-status.enum';
import { IProfile } from '../../../../api/src/shared/profile/profile.interface';
import { ILoginState } from '../models/login-state.interface';
import {
  IProfileMap,
  IProfileState,
} from '../models/profile-state.interface';
import { FULL_ROUTES } from '../routes/routes';
import { TokenService } from '../services/token.service';
import { STORE_SLICES } from '../store/store';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    @Inject(Router) private router: Router,
    @Inject(Store) private store: Store<any>,
    @Inject(TokenService) private tokenService: TokenService,
  ) { }

  async getProfile(): Promise<IProfile> {
    const token = this.tokenService.token;
    const loggedInUser = await this.store
      .select(STORE_SLICES.LOGIN)
      .pipe(take(1))
      .toPromise()
      .then((login: ILoginState) => login.user);

    if (!token || !loggedInUser || this.tokenService.isExpired) {
      this.router.navigate([FULL_ROUTES.LOGIN]);
      return Promise.resolve(null);
    }

    const profile = await this.store
      .select(STORE_SLICES.PROFILES)
      .pipe(take(1))
      .toPromise()
      .then((profiles: IProfileState) => profiles.profiles || {})
      .then((profiles: IProfileMap) => profiles[loggedInUser.id]);

    if (!profile) {
      this.router.navigate([FULL_ROUTES.LOGIN]);
      return Promise.resolve(null);
    }

    return Promise.resolve(profile);
  }

  async canLoad(): Promise<boolean> {
    return this.isAdmin();
  }

  async canActivate(): Promise<boolean> {
    return this.isAdmin();
  }

  async canActivateChild(): Promise<boolean> {
    return this.isAdmin();
  }

  private async isAdmin(): Promise<boolean> {
    const profile = await this.getProfile();

    const isAdmin = profile && profile.status === PROFILE_STATUS.APPROVED && profile.roles.includes(PROFILE_ROLES.ADMIN);

    if (!isAdmin) {
      console.error('You must be admin to load this route');
    }

    return isAdmin;

  }
}
