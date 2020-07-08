import { take } from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { PROFILE_STATUS } from '../../../../api/src/shared/profile/profile-status.enum';
import { IProfile } from '../../../../api/src/shared/profile/profile.interface';
import { ILoginState } from '../models/login-state.interface';
import {
  IProfileMap,
  IProfileState,
} from '../models/profile-state.interface';
import {
  editProfileRoute,
  FULL_ROUTES,
  ROOT_ROUTES,
  SUB_ROUTES,
} from '../routes/routes';
import { TokenService } from '../services/token.service';
import { STORE_SLICES } from '../store/store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
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

  async canLoad(_route: Route, segments: UrlSegment[]): Promise<boolean> {
    const url = segments.join('/');

    const profile = await this.getProfile();

    let can = false;

    const VIEW_PROFILE_ROUTE = `${ROOT_ROUTES.PROFILES}/${SUB_ROUTES.VIEW_PROFILE}/${profile.id}`;
    const EDIT_PROFILE_ROUTE = `${ROOT_ROUTES.PROFILES}/${SUB_ROUTES.EDIT_PROFILE}/${profile.id}`;

    switch (profile.status) {
      case PROFILE_STATUS.APPROVED:
        can = true;
        break;
      case PROFILE_STATUS.REGISTRATION:
        can = url === VIEW_PROFILE_ROUTE || url === EDIT_PROFILE_ROUTE;
        break;
      case PROFILE_STATUS.DEACTIVATED:
      case PROFILE_STATUS.PENDING_APPROVAL:
      case PROFILE_STATUS.REJECTED:
      default:
        can = false;
    }

    if (!can) {
      this.router.navigate([ROOT_ROUTES.ROOT]);
    }

    return can;
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  async checkLogin(url: string): Promise<boolean> {

    const profile = await this.getProfile();

    let redirectTo = null;
    let can = true;

    switch (profile.status) {
      case PROFILE_STATUS.APPROVED:
        can = true;
        break;
      case PROFILE_STATUS.REGISTRATION:
        redirectTo = editProfileRoute(profile.id);
        break;
      case PROFILE_STATUS.DEACTIVATED:
      case PROFILE_STATUS.PENDING_APPROVAL:
      case PROFILE_STATUS.REJECTED:
      default:
        redirectTo = FULL_ROUTES.ACCOUNT_REVIEW;
        break;
    }

    if (redirectTo) {
      can = redirectTo === url;
      if (!can) {
        this.router.navigate([redirectTo]);
      }
    }

    return can;
  }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
}
