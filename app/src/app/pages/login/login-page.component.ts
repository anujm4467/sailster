import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { PROFILE_STATUS } from '../../../../../api/src/shared/profile/profile-status.enum';
import { JwtObject } from '../../../../../api/src/shared/token/jwt-object.interface';
import {
  editProfileRoute,
  FULL_ROUTES,
} from '../../routes/routes';
import {
  authenticateWithGoogle,
  logIn,
} from '../../store/actions/login.actions';
import { STORE_SLICES } from '../../store/store';
import { decodeJwt } from '../../utils/jwt';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, route, router);
  }

  ngOnInit(): void {
    const token = this.route.snapshot.params.token;

    if (!token) {
      return;
    }

    const tokenObject: JwtObject = decodeJwt(token);

    if (tokenObject.expireAt < Date.now()) {
      this.authenticateWithGoogle();
      return;
    }

    this.subscribeToStoreSlice(STORE_SLICES.LOGIN, (login) => {
      if (!login.user || !login.token) {
        return;
      }

      switch (login.user.status) {
        case PROFILE_STATUS.APPROVED:
          this.goTo([FULL_ROUTES.DASHBOARD], undefined);
          break;
        case PROFILE_STATUS.REGISTRATION:
          this.goTo([editProfileRoute(login.user.id)], undefined);
          break;
        case PROFILE_STATUS.PENDING_APPROVAL:
        case PROFILE_STATUS.DEACTIVATED:
        case PROFILE_STATUS.REJECTED:
        default:
          this.goTo([FULL_ROUTES.ACCOUNT_REVIEW], undefined);
          break;
      }
    });

    this.dispatchAction(logIn({ token }));
  }

  public authenticateWithGoogle(): void {
    this.dispatchAction(authenticateWithGoogle());
  }

}
