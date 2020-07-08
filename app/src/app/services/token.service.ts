import {
  Inject,
  Injectable,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ILoginState } from '../models/login-state.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private login: ILoginState = {} as ILoginState;

  constructor(@Inject(Store) store: Store<any>) {
    store.select('login').subscribe(login => this.login = login);
  }

  public get token(): string {
    return (this.login || {} as ILoginState).token;
  }

  public get tokenData(): any {
    return (this.login || {} as ILoginState).tokenData;
  }

  public get isExpired(): boolean {
    if (!this.login || !this.login.tokenData) {
      return true;
    }

    const exp = this.login.tokenData.exp;

    return Date.now() >= (exp * 1000);
  }
}
