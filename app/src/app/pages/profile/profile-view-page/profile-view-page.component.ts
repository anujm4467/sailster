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
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import {
  editProfilePrivilegesRoute,
  editProfileRoute,
  viewClinicRoute,
  viewUserSailsRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

export enum EDIT_ACTIONS {
  UPDATE_INFO = 'update info',
  UPDATE_ACCESS = 'update access'
}

@Component({
  selector: 'app-profile-view-page',
  templateUrl: './profile-view-page.component.html',
  styleUrls: ['./profile-view-page.component.css']
})
export class ProfileViewPageComponent extends BasePageComponent implements OnInit {
  public captionActions = [
    {
      name: EDIT_ACTIONS.UPDATE_INFO,
      icon: 'edit',
      tooltip: EDIT_ACTIONS.UPDATE_INFO,
    },
    {
      name: EDIT_ACTIONS.UPDATE_ACCESS,
      icon: 'security',
      tooltip: EDIT_ACTIONS.UPDATE_ACCESS,
    }
  ];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

  }

  public get canViewSails(): boolean {
    return this.user.profile.id === this.profileId || this.user.access.viewUserSails;
  }

  public get profileId(): string {
    return this.route.snapshot.params.id;
  }

  public get profile(): IProfile {
    return this.getProfile(this.profileId);
  }

  public get canEditPrivileges(): boolean {
    const can = this.user.access.editUserAccess;

    return !!can;
  }

  public get canEditInfo(): boolean {
    const can = this.user.profile.id === this.profileId || this.user.access.editUserProfile;

    return !!can;
  }

  public actionsClicked(event): void {
    switch (event) {
      case EDIT_ACTIONS.UPDATE_INFO:
        this.goTo([this.editProfileInfoLink(this.profileId)]);
        break;
      case EDIT_ACTIONS.UPDATE_ACCESS:
        this.goTo([this.editProfilePrivilegesLink(this.profileId)]);
        break;
    }
  }

  public editProfileInfoLink(profileId: string): string {
    return editProfileRoute(profileId);
  }

  public editProfilePrivilegesLink(profileId: string): string {
    return editProfilePrivilegesRoute(profileId);
  }

  public viewUserSailsRouteLink(profileId: string): string {
    return viewUserSailsRoute(profileId);
  }

  public goToClinic(clinicId: string): void {
    this.goTo([viewClinicRoute(clinicId)]);
  }
}
