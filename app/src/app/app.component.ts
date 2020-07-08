import { takeWhile } from 'rxjs/operators';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { IProfile } from '../../../api/src/shared/profile/profile.interface';
import { IAppState } from './models/app-state.interface';
import {
  ISnackState,
  Snack,
  SnackType,
} from './models/snack-state.interface';
import { BasePageComponent } from './pages/base-page/base-page.component';
import { setAppFontSize } from './store/actions/app.actions';
import { logOut } from './store/actions/login.actions';
import {
  putSnack,
  removeSnack,
} from './store/actions/snack.actions';
import { STORE_SLICES } from './store/store';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent extends BasePageComponent implements OnInit {
  private loadingTimer: any;
  private readonly LOADING_TIME = 1000;
  private readonly SNACK_DEFAULT_TIME = 2000;
  private readonly SNACK_GREET_TIME = 4000;
  private snackRef;
  private snacks: Snack[] = [];
  public readonly title = 'Blind Sailing Canada';
  public userProfile: IProfile;
  public changingAppFont = false;
  private currentFontSize;

  constructor(
    @Inject(MatSnackBar) private snackBar: MatSnackBar,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, null, null);
  }

  ngOnInit(): void {

    this.subscribeToStoreSlice(STORE_SLICES.APP, (appState: IAppState) => {
      if (appState.loading) {
        this.startLoadingTimer();
      }

      this.changingAppFont = appState.changingFont;

      if (this.currentFontSize !== appState.fontSize) {
        this.currentFontSize = appState.fontSize;
        this.setFontSize(this.currentFontSize);
      }
    });

    this.subscribeToStore(STORE_SLICES.SNACKS)
      .subscribe((snacks: ISnackState) => {
        this.snacks = snacks.snacks;
        this.processSnacks(this.snacks);
      });

    this.subscribeToStore(STORE_SLICES.LOGIN)
      .subscribe((login) => {
        this.userProfile = login.user;

        if (this.userProfile) {
          const message = `Welcome, ${this.userProfile.name}! ☺`;
          this.dispatchAction(
            putSnack({
              snack: {
                message,
                type: SnackType.INFO,
                options: {
                  duration: this.SNACK_GREET_TIME,
                  verticalPosition: 'top',
                },
              },
            })
          );
        }
      });
  }

  public changeFontSize(size: string): void {
    this.dispatchAction(setAppFontSize({ fontSize: size }));
    this.dispatchAction(putSnack({ snack: { message: `Changing font to ${size}`, type: SnackType.INFO, options: { duration: 300 } } }));
  }

  private startLoadingTimer() {
    if (this.loadingTimer) {
      return;
    }

    this.isLoading = this.loading;

    this.loadingTimer = setTimeout(
      () => {
        this.isLoading = this.loading;
        this.loadingTimer = null;

        if (this.isLoading) {
          this.startLoadingTimer();
        }
      },
      this.LOADING_TIME,
    );
  }

  public logout(): void {
    this.dispatchAction(logOut({ message: 'Bye! See you soon!' }));
  }

  private processSnacks(snacks) {
    if (snacks.length) {
      if (this.snackRef) {
        this.snackRef.dismiss();
        return;
      }

      const snack = snacks[0];

      switch (snack.type) {
        case SnackType.ERROR:
          this.snackRef = this.openSnackBar(`Error: ${snack.message}`, 'ok', snack.options);
          break;
        case SnackType.INFO:
          this.snackRef = this.openSnackBar(`${snack.message}`, 'ok', snack.options);
          break;
      }

      this.snackRef
        .afterDismissed()
        .pipe(
          takeWhile(() => this.active),
        )
        .subscribe(() => {
          this.dispatchAction(removeSnack({ index: 0 }));
          this.snackRef = null;
          this.processSnacks(this.snacks);
        });
    }
  }

  private openSnackBar(message: string, action: string, options = {}) {
    const defaultOptions = {
      duration: this.SNACK_DEFAULT_TIME,
    };
    const finalOptions = Object.assign({}, defaultOptions, options);

    return this.snackBar.open(message, action, finalOptions);
  }

}
