import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TokenService } from '../services/token.service';
import { logOut } from '../store/actions/login.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    @Inject(TokenService) private tokenService: TokenService,
    @Inject(Store) private store: Store<any>,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tokenService.token;
    const expired = this.tokenService.isExpired;
    const path = req.url;

    if (path !== '/api/auth/logout' && token && expired) {
      this.store.dispatch(logOut({ message: 'Your session has expired.' }));
      const newReq = req.clone({ method: 'HEAD', url: '/dummy-route/403-your-session-expired', body: null, headers: new HttpHeaders() });
      return next.handle(newReq);
    }

    if (token && !expired) {
      const clonedRequest = req.clone({ headers: req.headers.set('authorization', `Bearer ${token}`) });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
