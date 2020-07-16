import { takeWhile } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  OnDestroy,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  Action,
  select,
  Store,
} from '@ngrx/store';
import { IBoat } from '../../../../../api/src/shared/boat/boat.interface';
import { IClinic } from '../../../../../api/src/shared/clinic/clinic.interface';
import { IBoatMaintenance } from '../../../../../api/src/shared/maintenance/maintenance.interface';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { ISailChecklist } from '../../../../../api/src/shared/sail-checklist/sail-checklist.interface';
import { ISail } from '../../../../../api/src/shared/sail/sail.interface';
import { BoatDialogComponent } from '../../components/boat-dialog/boat-dialog.component';
import { ProfileDialogComponent } from '../../components/profile-dialog/profile-dialog.component';
import { IAppState } from '../../models/app-state.interface';
import { BoatDialogData } from '../../models/boat-dialog-data.interface';
import { IBoatMaintenanceMap } from '../../models/boat-maintenance-state.interface';
import { IBoatMap } from '../../models/boat-state.interface';
import { ICDNState } from '../../models/cdn-state.interface';
import { ClinicsState } from '../../models/clinics.state';
import { FONT_SIZE } from '../../models/font-size';
import {
  InstructionsMap,
  InstructionsState,
} from '../../models/instructions-state.interface';
import { ProfileDialogData } from '../../models/profile-dialog-data.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import {
  ISailChecklistMap,
  ISailChecklistState,
} from '../../models/sail-checklist-state.interface';
import { ISailRequestState } from '../../models/sail-request-state.interface';
import { ISailMap } from '../../models/sail-state.interface';
import { User } from '../../models/user.interface';
import {
  viewBoatRoute,
  viewProfileRoute,
  viewSailRoute,
} from '../../routes/routes';
import {
  finishChangingAppFont,
  startChangingAppFont,
} from '../../store/actions/app.actions';
import {
  fetchBoatMaintenance,
  fetchBoatMaintenances,
} from '../../store/actions/boat-maintenance.actions';
import {
  fetchBoat,
  fetchBoats,
} from '../../store/actions/boat.actions';
import { fetchClinic } from '../../store/actions/clinic.actions';
import { fetchCrewPerson } from '../../store/actions/crew.actions';
import { fetchInstructionByBoat } from '../../store/actions/instructions.actions';
import { fetchProfile } from '../../store/actions/profile.actions';
import { fetchSailChecklist } from '../../store/actions/sail-checklist.actions';
import { fetchSail } from '../../store/actions/sail.actions';
import { fetchSkipper } from '../../store/actions/skipper.actions';
import { STORE_SLICES } from '../../store/store';

@Component({
  template: ''
})
export class BasePageComponent implements OnDestroy, AfterViewInit {
  private static _isLoading: boolean;
  protected active = true;
  private storeData = {};
  protected _fetching = {};

  constructor(
    private _store?: Store<any>,
    private activeRoute?: ActivatedRoute,
    private router?: Router,
    private dialog?: MatDialog,
  ) {
    this.subscribeToStoreSlice(STORE_SLICES.APP);
    this.subscribeToStoreSlice(STORE_SLICES.LOGIN);
  }

  protected setFontSize(fontSize: string): void {
    if (!fontSize || fontSize === FONT_SIZE[FONT_SIZE.default]) {
      return;
    }

    const main: HTMLElement = document.getElementsByTagName('main')[0];

    if (!main) {
      return;
    }

    this.dispatchAction(startChangingAppFont());
    setTimeout(
      () => {
        this.setFontSizeRecursivly(main, fontSize);
        this.dispatchAction(finishChangingAppFont());
      },
      500,
    );
  }

  private setFontSizeRecursivly(startFrom: HTMLElement, fontSize: string): void {
    startFrom
      .childNodes
      .forEach((element: HTMLElement) => {
        if (!element.style) {
          return;
        }

        const newSize = `font-size: ${fontSize} !important;`;
        element.style.cssText += `; ${newSize}`;

        this.setFontSizeRecursivly(element, fontSize);
      });
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  ngAfterViewInit(): void {
    const appState: IAppState = this.store[STORE_SLICES.APP];

    if (appState.fontSize !== 'default') {
      this.setFontSize(appState.fontSize);
    }

    setTimeout(
      () => {
        window.scrollTo(0, 0);
        const title = document.getElementById('pageTitle');
        if (title) {
          title.focus();
        }
      },
      200);
  }

  public picturesArray(picture: string): string[] {
    const array = (picture || '').split(',').map(url => url.trim());
    return array;
  }

  public get isLoading(): boolean {
    return BasePageComponent._isLoading;
  }

  public set isLoading(loading: boolean) {
    BasePageComponent._isLoading = loading;
  }

  public get loading(): boolean {
    return !!this.store.app.loading;
  }

  protected get route() {
    return this.activeRoute;
  }

  protected get store() {
    return this.storeData as any;
  }

  public get user(): User {
    const user = (this.store.login || {}).user;

    if (!user) {
      return null;
    }

    const tokenData = (this.store.login || {}).tokenData;

    return {
      profile: user,
      roles: (user || {}).roles,
      access: ((tokenData || {}).access || {}).access || {},
    };
  }

  public get instructions(): InstructionsState {
    return this.store.instructions || {} as InstructionsState;
  }

  public get boats(): IBoatMap {
    return this.store.boats || {} as IBoatMap;
  }

  public get boatsArray(): IBoat[] {
    return Object.values(this.boats);
  }

  public get skippers(): IProfileMap {
    return this.store.skippers || {} as IProfileMap;
  }

  public get sailRequests(): ISailRequestState {
    return this.store[STORE_SLICES.SAIL_REQUESTS] || {} as ISailRequestState;
  }

  public getChecklist(id: string): ISailChecklist {
    const checklist = this.store.checklists.all[id];

    if (checklist === undefined && !this._fetching[id]) {
      this._fetching[id] = true;
      this.dispatchAction(fetchSailChecklist({ id }));
    }

    if (checklist && this._fetching[id]) {
      delete this._fetching[id];
    }

    return checklist;
  }

  public get sailChecklists(): ISailChecklistMap {
    const sailChecklistState = this.store[STORE_SLICES.CHECKLISTS] || {} as ISailChecklistState;
    return sailChecklistState.all;
  }

  public get cdn(): ICDNState {
    return this.store.cdn || {} as ICDNState;
  }

  public get crew(): IProfileMap {
    return this.store.crew || {} as IProfileMap;
  }

  public get members(): IProfileMap {
    return this.store.members || {} as IProfileMap;
  }

  public get maintenances(): IBoatMaintenanceMap {
    return this.store.maintenances || {} as IBoatMaintenanceMap;
  }

  public get maintenancesArray(): IBoatMaintenance[] {
    return Object.values(this.store.maintenances || {}) as IBoatMaintenance[];
  }

  public get profiles(): IProfileMap {
    return (this.store.profiles || {}).profiles || {} as IProfileMap;
  }

  public get clinics(): ClinicsState {
    return (this.store.clincs || {}) as ClinicsState;
  }

  public get profilesArray(): IProfile[] {
    return Object.values<IProfile>((this.store.profiles || {}).profiles || {} as IProfileMap).filter(profile => !!profile);
  }

  public get sails(): ISailMap {
    return (this.store.sails || {}).all || {} as ISailMap;
  }

  public get sailsSearchResults(): ISail[] {
    return (this.store.sails || {}).search || [] as ISail[];
  }

  protected goTo(data, options?) {
    return this.router.navigate(data, options);
  }

  protected copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  public getSail(id: string): ISail {
    const sail = this.sails[id];

    if (sail) {
      delete this._fetching[id];
    } else if (sail === undefined && !this._fetching[id]) {
      this.fetchSail(id);
    }

    return sail;
  }

  public getBoat(id: string): IBoat {
    if (!id) {
      return;
    }

    if (this.boats[id] === undefined) {
      this.fetchBoat(id);
      return;
    }
    return this.boats[id];
  }

  public getClinic(id: string): IClinic {
    if (!id) {
      return;
    }

    if (this.clinics[id] === undefined) {
      this.fetchClinic(id);
      return;
    }
    return this.profiles[id];
  }

  public getBoatInstructions(boatId: string): InstructionsMap {
    if(!this.instructions[boatId]) {
      this.fetchBoatInstructions(boatId);
    }

    return this.instructions[boatId];
  }

  public fetchBoatInstructions(boatId: string): void {
    if (this._fetching[boatId]) {
      return;
    }

    this._fetching[boatId] = true;
    this.dispatchAction(fetchInstructionByBoat({ boatId }));
  }

  public getProfile(id: string): IProfile {
    if (!id) {
      return;
    }

    if (this.profiles[id] === undefined) {
      this.fetchProfile(id);
      return;
    }
    return this.profiles[id];
  }

  protected fetchProfile(id: string): void {
    if (this._fetching[id]) {
      return;
    }
    this._fetching[id] = true;
    this.dispatchAction(fetchProfile({ id }));
  }

  protected fetchClinic(id: string): void {
    if (this._fetching[id]) {
      return;
    }
    this._fetching[id] = true;
    this.dispatchAction(fetchClinic({ clinicId: id }));
  }

  protected fetchCrew(id: string): void {
    if (this._fetching[id]) {
      return;
    }
    this._fetching[id] = true;
    this.dispatchAction(fetchCrewPerson({ id }));
  }

  protected fetchSkipper(id: string): void {
    if (this._fetching[id]) {
      return;
    }
    this._fetching[id] = true;
    this.dispatchAction(fetchSkipper({ id }));
  }

  protected fetchSail(id: string, options = {} as any): void {
    if (!this._fetching[id]) {
      this._fetching[id] = true;
      this.dispatchAction(fetchSail({ id, ...options }));
    }
  }

  protected fetchBoat(id: string): void {
    if (!this._fetching[id]) {
      this._fetching[id] = true;
      this.dispatchAction(fetchBoat({ id }));
    }
  }

  protected fetchBoatMaintenances(query: string, notify?: boolean): void {
    this.dispatchAction(fetchBoatMaintenances({ query, notify }));
  }

  protected fetchBoatMaintenance(id: string, notify?: boolean): void {
    if (this._fetching[id]) {
      return;
    }
    this._fetching[id] = true;
    this.dispatchAction(fetchBoatMaintenance({ id, notify }));
  }

  protected fetchBoats(notify?: boolean): void {
    this.dispatchAction(fetchBoats({ notify }));
  }

  protected subscribeToStoreSlice(slice, callback?: (data?: any) => void) {
    this.subscribeToStore(slice)
      .subscribe((data) => {
        this.storeData[slice] = this.copy(data);
        const ids = Object.keys(this.storeData[slice]);
        ids.forEach(id => delete this._fetching[id]);

        if (callback) {
          callback(this.storeData[slice]);
        }
      });
  }

  protected subscribeToStoreSliceWithUser(slice, callback?: (data?: any) => void) {
    this.subscribeToStoreWithUser(slice)
      .subscribe((data) => {
        this.storeData[slice] = this.copy(data);
        const ids = Object.keys(this.storeData[slice]);
        ids.forEach(id => delete this._fetching[id]);

        if (callback) {
          callback(this.storeData[slice]);
        }
      });
  }

  protected subscribeToStore(store: string) {
    return this._store
      .pipe(
        takeWhile(() => this.active),
        select(store)
      );
  }

  protected subscribeToStoreWithUser(store: string) {
    return this._store
      .pipe(
        takeWhile(() => this.active && !!this.user),
        select(store)
      );
  }

  protected dispatchAction(action: Action) {
    this._store.dispatch(action);
  }

  protected showBoatDialog(boat: IBoat, type: string): MatDialogRef<any> {
    if (!boat) {
      return;
    }

    const dialogData: BoatDialogData = {
      boat,
      type,
      viewBoat: (id: string) => this.viewBoat(id),
    };

    this.dialog
      .open(BoatDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  protected showProfileDialog(profile: IProfile, type: string): MatDialogRef<any> {
    if (!profile) {
      return;
    }

    const dialogData: ProfileDialogData = {
      profile,
      type,
      viewProfile: (id: string) => this.viewProfile(id),
    };

    return this.dialog
      .open(ProfileDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  protected viewSail(id: string): void {
    this.goTo([viewSailRoute(id)]);
  }

  protected viewBoat(id: string): void {
    this.goTo([viewBoatRoute(id)]);
  }

  protected viewProfile(id: string): void {
    this.goTo([viewProfileRoute(id)]);
  }

}
