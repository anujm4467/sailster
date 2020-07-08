import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Action,
  Store,
} from '@ngrx/store';
import { PROFILE_ROLES } from '../../../../../../api/src/shared/profile/profile-roles.enum';
import { PROFILE_STATUS } from '../../../../../../api/src/shared/profile/profile-status.enum';
import {
  IProfile,
  PROFILE_PROPS,
} from '../../../../../../api/src/shared/profile/profile.interface';
import { IRequiredAction } from '../../../../../../api/src/shared/required-action/required-action.interface';
import { REQUIRED_ACTION_STATE } from '../../../../../../api/src/shared/required-action/required-action.state';
import {
  IUserAccess,
  USER_ACCESS_FIELDS,
} from '../../../../../../api/src/shared/user-access/user-access.interface';
import { RequiredActionsState } from '../../../models/required-actions.state';
import { viewProfileRoute } from '../../../routes/routes';
import { updateProfileAccess } from '../../../store/actions/profile.actions';
import {
  completeRequiredAction,
  dismissRequiredAction,
} from '../../../store/actions/required-actions.actions';
import {
  fetchUserAccess,
  updateUserAccess,
} from '../../../store/actions/user-access.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-admin-user-edit-page',
  templateUrl: './admin-user-edit-page.component.html',
  styleUrls: ['./admin-user-edit-page.component.css']
})
export class AdminUserEditPageComponent extends BasePageComponent implements OnInit {

  private requiredActionId: string = null;
  public UserAccessFields = USER_ACCESS_FIELDS;
  public profileAccess: IUserAccess = {};
  public profileForm: FormGroup;
  public profileRoles = PROFILE_ROLES;
  public profileStatus = PROFILE_STATUS;
  public requiredAction: IRequiredAction = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.requiredActionId = this.route.snapshot.queryParams.completeRequiredAction;

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.updateForm();
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.USER_ACCESS, () => {
      this.profileAccess = this.store[STORE_SLICES.USER_ACCESS][this.profileId];
      this.updateForm();
    });

    this.subscribeToStoreSlice(STORE_SLICES.REQUIRED_ACTIONS, (requiredActionState: RequiredActionsState) => {
      this.requiredAction = requiredActionState.actions[this.requiredActionId];

      if (this.requiredAction && this.requiredAction.state !== REQUIRED_ACTION_STATE.NEW) {
        this.requiredAction = null;
      }

    });

    this.dispatchAction(fetchUserAccess({ profileId: this.profileId }));
  }

  public setStatus(status: string): void {
    const input = document.getElementById(`status_${status}-input`);
    input.click();
  }

  public dismissRequiredAction(): void {
    this.dispatchAction(dismissRequiredAction({ actionId: this.requiredActionId, notify: true }));
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      [PROFILE_PROPS.STATUS]: this.fb.control(null),
      [PROFILE_PROPS.ROLES]: [],
      access: [],
    });

  }

  private updateForm(): void {
    const updatedForm: any = {};

    if (this.profileAccess) {
      const access = Object
        .keys((this.profileAccess || {}).access || {})
        .filter(key => this.profileAccess.access[key]);

      updatedForm.access = access;
    }

    if (this.profile) {
      updatedForm.status = this.profile.status;
      updatedForm.roles = this.profile.roles;
    }

    this.profileForm.patchValue(updatedForm);
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  public clearRolesAccess(): void {
    this.profileForm.get(PROFILE_PROPS.ROLES).setValue([]);
    this.profileForm.get('access').setValue([]);

    this.profileForm.updateValueAndValidity();
    this.profileForm.markAsDirty();
  }

  public get profileId(): string {
    return this.route.snapshot.params.id;
  }

  public get profile(): IProfile {
    return this.getProfile(this.profileId);
  }

  public get shouldDisableSave(): boolean {
    const should = !this.profileForm.valid || !this.profileForm.dirty;

    return should;
  }

  public saveProfile(): void {
    const data: any = Object.keys(this.profileForm.controls)
      .filter(control => this.profileForm.get(control).dirty)
      .reduce(
        (red, control) => {
          red[control] = this.profileForm.get(control).value;
          return red;
        },
        {},
      );

    const access = data.access;

    if (access) {
      const changedAccess = access
        .reduce(
          (red, key) => {
            red[key] = true;
            return red;
          },
          {},
        );

      this.dispatchAction(updateUserAccess({ profileId: this.profileId, access: { access: changedAccess } }));
    }

    delete data.access;

    const requiredAction: Action = this.requiredActionId ?
      completeRequiredAction({ actionId: this.requiredActionId }) : undefined;

    this.dispatchAction(updateProfileAccess({
      id: this.profileId,
      profile: data,
      notify: true,
      completeRequiredAction: requiredAction,
    }));

  }

  public viewProfile(id): string {
    return viewProfileRoute(id);
  }
}
