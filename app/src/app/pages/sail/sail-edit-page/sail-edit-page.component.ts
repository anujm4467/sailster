import {
  interval,
  Observable,
} from 'rxjs';
import {
  debounce,
  distinctUntilChanged,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IBoat } from '../../../../../../api/src/shared/boat/boat.interface';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import {
  editSailCrewRoute,
  editSailPassengersRoute,
  editSailSkipperRoute,
} from '../../../routes/routes';
import { MomentService } from '../../../services/moment.service';
import { SailService } from '../../../services/sail.service';
import { putBoats } from '../../../store/actions/boat.actions';
import {
  createSail,
  fetchSail,
  updateSail,
} from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-edit-page',
  templateUrl: './sail-edit-page.component.html',
  styleUrls: ['./sail-edit-page.component.css']
})
export class SailEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public availableBoats: IBoat[] = [];
  public availableCrew: IProfile[] = [];
  public availableMembers: IProfile[] = [];
  public availableSkippers: IProfile[] = [];
  public creatingNewSail = false;
  public sailForm: FormGroup;
  public sailId: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MomentService) private momentService: MomentService,
    @Inject(SailService) private sailsService: SailService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.sailId = this.route.snapshot.params.id;
    this.creatingNewSail = !this.sailId;

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      const sail = this.sails[this.sailId] || {} as ISail;
      const boatId = this.sailForm.controls.boat.value || sail.boat;
      this.updateMaxOccupancy(boatId);
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      if (!this.creatingNewSail) {
        const sail = this.sails[this.sailId];

        if (sail === undefined && !this._fetching[this.sailId]) {
          this._fetching[this.sailId] = true;
          this.dispatchAction(fetchSail({ id: this.sailId }));
          return;
        }

        if (!sail) {
          return;
        }

        this.updateForm(sail);

      }
    });

  }

  private updateForm(sail: ISail): void {
    const formValues = this.sailForm.getRawValue();
    this.sailForm.controls.name.setValue(formValues.name || sail.name);
    this.sailForm.controls.description.setValue(formValues.description || sail.description);
    this.sailForm.controls.name.setValue(formValues.name || sail.name);

    const startMoment = this.momentService.moment(sail.start);

    const sailStart = startMoment.toDate();
    const startDate = sailStart;
    const startTime = startMoment.format('HH:mm');

    const endMomemnt = this.momentService.moment(sail.end);
    const sailEnd = endMomemnt.toDate();
    const endDate = sailEnd;
    const endTime = endMomemnt.format('HH:mm');

    const yyyymmddStart = this.momentService.yyyymmdd(formValues.startDate || startDate);
    const yyyymmddEnd = this.momentService.yyyymmdd(formValues.endDate || endDate);

    this.sailForm.controls.startDate.setValue(yyyymmddStart);
    this.sailForm.controls.startTime.setValue(formValues.startTime || startTime);
    this.sailForm.controls.endDate.setValue(yyyymmddEnd);
    this.sailForm.controls.endTime.setValue(formValues.endTime || endTime);

    this.sailForm.controls.boat.setValue(formValues.boat || sail.boat);
  }

  private buildForm(): void {
    this.sailForm = this.fb.group({
      name: new FormControl('', [
        (control) => {
          const name = control.value.trim();
          const valid = control.pristine || !!name;
          return valid ? null : { invalid: 'Sail name cannot be empty.' };
        },
        Validators.required,
      ]),
      description: new FormControl(undefined),
      startDate: new FormControl(undefined, Validators.required),
      start: new FormControl(undefined, [
        Validators.required,
        (control) => {
          if (!this.sailForm) {
            return null;
          }
          if (!control.value) {
            return null;
          }
          const selectedDate = new Date(control.value);
          const now = Date.now();
          const end = this.sailForm.controls.end.value;

          if (!end) {
            return null;
          }

          const valid = !this.creatingNewSail || selectedDate.getTime() > now;
          return valid ? null : { 'Start date cannot be in the past!': control.value };
        },
      ]),
      startTime: new FormControl(undefined, Validators.required),
      endDate: new FormControl(undefined, Validators.required),
      endTime: new FormControl(undefined, Validators.required),
      end: new FormControl(undefined, [
        Validators.required,
        ((control) => {
          if (!this.sailForm) {
            return null;
          }
          if (!control.value) {
            return null;
          }
          const selectedDate = new Date(control.value);
          const start = this.sailForm.controls.start.value;
          const endTime = selectedDate.getTime();
          const startTime = start.getTime();
          const valid = endTime > startTime;

          return valid ? null : { 'End date must be greater than start date!': control.value };
        }).bind(this),
      ]),
      boat: new FormControl(undefined, Validators.required),
      maxOccupancy: new FormControl(undefined, Validators.required),
    });

    this.sailForm
      .controls
      .boat
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe(boatId => this.updateMaxOccupancy(boatId));

    this.sailForm
      .controls
      .startDate
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe((value) => {
        const date = this.buildDate(value, this.sailForm.controls.startTime.value);
        this.sailForm.controls.start.setValue(date);
        this.sailForm.controls.start.updateValueAndValidity();

        const endDate = this.momentService.moment(this.sailForm.controls.endDate.value || new Date()).toDate();

        if (endDate.getTime() < date.getTime()) {
          const formatedDate = this.momentService.yyyymmdd(date);
          this.sailForm.controls.endDate.setValue(formatedDate);
          this.sailForm.controls.endDate.updateValueAndValidity();
        }
      });

    this.sailForm
      .controls
      .startTime
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe((value) => {
        const date = this.buildDate(this.sailForm.controls.startDate.value, value);
        this.sailForm.controls.start.setValue(date);
        this.sailForm.controls.start.updateValueAndValidity();
      });

    this.sailForm
      .controls
      .endDate
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe((value) => {
        const date = this.buildDate(value, this.sailForm.controls.endTime.value);
        this.sailForm.controls.end.setValue(date);
        this.sailForm.controls.end.updateValueAndValidity();
      });

    this.sailForm
      .controls
      .endTime
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe((value) => {
        const date = this.buildDate(this.sailForm.controls.endDate.value, value);
        this.sailForm.controls.end.setValue(date);
        this.sailForm.controls.end.updateValueAndValidity();
      });

    this.fetchBoatsOnSailDateChanges();

    if (this.creatingNewSail) {
      const startMoment = this.momentService.moment(new Date());

      startMoment.add(1, 'day');

      const sailStart = startMoment.toDate();
      const startDate = sailStart;
      const startTime = startMoment.format('HH:mm');

      startMoment.add(3, 'hours');

      const sailEnd = startMoment.toDate();
      const endDate = sailEnd;
      const endTime = startMoment.format('HH:mm');

      this.sailForm.controls.startDate.setValue(this.momentService.yyyymmdd(startDate));
      this.sailForm.controls.startTime.setValue(startTime);
      this.sailForm.controls.endDate.setValue(this.momentService.yyyymmdd(endDate));
      this.sailForm.controls.endTime.setValue(endTime);
    }
  }

  public editSkipper(): void {
    this.goTo([editSailSkipperRoute(this.sailId)]);
  }

  public editCrew(): void {
    this.goTo([editSailCrewRoute(this.sailId)]);
  }

  public editPassengers(): void {
    this.goTo([editSailPassengersRoute(this.sailId)]);
  }

  private fetchBoatsOnSailDateChanges(): void {
    this.sailForm
      .controls
      .start
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
        debounce(() => interval(1000)),
        distinctUntilChanged(),
        switchMap(() => this.fetchAvailableBoats()),
      )
      .subscribe((boats) => {
        this.availableBoats = boats;
        this.dispatchAction(putBoats({ boats }));
      });

    this.sailForm
      .controls
      .end
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
        debounce(() => interval(1000)),
        distinctUntilChanged(),
        switchMap(() => this.fetchAvailableBoats()),
      )
      .subscribe((boats) => {
        this.availableBoats = boats;
        this.dispatchAction(putBoats({ boats }));
      });
  }

  private fetchAvailableBoats(): Observable<IBoat[]> {
    const startDate: Date = this.sailForm.controls.start.value;
    const endDate: Date = this.sailForm.controls.end.value;
    return this.sailsService.fetchAvailableBoats(startDate.toISOString(), endDate.toISOString());
  }

  public setSailBoat(id?: string): void {
    this.sailForm.controls.boat.setValue(id || null);
    this.sailForm.controls.boat.markAsDirty();
    this.sailForm.controls.boat.markAsTouched();
  }

  public get title(): string {
    return this.creatingNewSail ? 'New Sail Form' : 'Edit Sail Form';
  }

  private updateMaxOccupancy(boatId): void {
    const defaultMax = 6;
    const boat = this.boats[boatId] as IBoat;

    if (!boat) {
      this.sailForm.controls.maxOccupancy.patchValue(undefined);
      return;
    }

    const boatMax = boat.maxOccupancy || defaultMax;
    this.sailForm.controls.maxOccupancy.patchValue(boatMax);
  }

  public get nameErrors(): string[] {
    const errors = this.sailForm.controls.name.errors || {};
    const errorKeys = Object.keys(errors);
    const errorStrings = errorKeys.map(key => `${key}: ${errors[key]}`);

    return errorStrings;
  }

  public get startDateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.start.errors || {});
    return errors;
  }

  public get endDateErrors(): string[] {
    const errors = Object.keys(this.sailForm.controls.end.errors || {});
    return errors;
  }

  private getControlProperty(control, field, property = 'name') {
    if (!this.sailForm || !control) {
      return '';
    }

    const id = this.sailForm.getRawValue()[control];
    const item = this[field][id];

    if (item === null) {
      return null;
    }

    return item ? item[property] : undefined;
  }

  public get maxOccupancy(): number {
    const boatId = this.sailForm.controls.boat.value;
    const defaultValue = 6;
    const boatValue = (this.boats[boatId] || {} as IBoat).maxOccupancy || defaultValue;
    const formValue = +this.sailForm.controls.maxOccupancy.value || boatValue;

    const max = Math.min(boatValue, formValue);

    return max;
  }

  public get maxPassengers(): number {
    const maxOccupancy = +this.sailForm.getRawValue().maxOccupancy;
    const maxPassengers = maxOccupancy - 2;
    return maxPassengers;
  }

  public get boatName(): string {
    const name = this.getControlProperty('boat', 'boats', 'name');
    return name;
  }

  public get skipperName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    const skipperId = sail.skipper;

    if (!skipperId) {
      return;
    }

    return (this.getProfile(skipperId) || { name: 'cannot resolve' }).name;
  }

  public get crewName(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    const crewId = sail.crew;

    if (!crewId) {
      return;
    }

    return (this.getProfile(crewId) || { name: 'cannot resolve' }).name;
  }

  public get passengerNames(): string {
    if (this.creatingNewSail) {
      return '';
    }

    const sail = this.getSail(this.sailId);
    const passengerIds: string[] = [].concat(sail.passengers || []);
    const names = passengerIds.map(id => (this.getProfile(id) || { name: 'cannot resolve' }).name).join(', ');

    return names;
  }

  public getTime(type): string {
    if (!this.sailForm || !type) {
      return '';
    }
    const dateString = this.sailForm.controls[`${type}Date`].value as string;
    const time = this.sailForm.controls[`${type}Time`].value as string;

    const [hours, minutes] = time.split(':');

    const date = this.momentService.moment(dateString).toDate();

    date.setHours(+hours);
    date.setMinutes(+minutes);
    date.setSeconds(0);

    const formatedDateString = this.momentService.moment(date).format('MMMM Do YYYY, h:mm a');
    return formatedDateString;
  }

  public get shouldEnableUpdateButton(): boolean {
    const isFormValid = this.sailForm.valid;
    const isFormDirty = this.sailForm.dirty;
    const should = !this.creatingNewSail && isFormValid && isFormDirty;

    return should;
  }

  public get shouldEnableCreateButton(): boolean {
    const isFormValid = this.sailForm.valid;
    const isFormDirty = this.sailForm.dirty;
    const should = this.creatingNewSail && isFormValid && isFormDirty;

    return should;
  }

  private buildDate(date: Date, time: string) {
    const [hours, minutes] = (time || '0:0').split(':');
    const newDate = this.momentService.moment(date).toDate();

    newDate.setHours(+hours);
    newDate.setMinutes(+minutes);
    newDate.setSeconds(0);

    return new Date(newDate);
  }

  public createSail(): void {
    const data = this.sailForm.getRawValue();
    data.start = this.buildDate(data.startDate, data.startTime);
    data.end = this.buildDate(data.endDate, data.endTime);

    delete data.startDate;
    delete data.startTime;
    delete data.endDate;
    delete data.endTime;

    const sail = this.copy(data) as ISail;
    // JSON.stringify changes date to UTC
    // so we need to convert to local time
    sail.start = new Date(sail.start).toString();
    sail.end = new Date(sail.end).toString();

    this.dispatchAction(createSail({ sail }));
  }

  public updateSail(): void {
    const formControls = this.sailForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          red[key] = formControls[key].value ? formControls[key].value : null;
          return red;
        },
        {}
      ) as any;

    if (changedValue.startDate !== undefined || changedValue.startTime !== undefined) {
      const startDate = this.sailForm.controls.startDate.value;
      const startTime = this.sailForm.controls.startTime.value;

      const start = this.buildDate(startDate, startTime);
      changedValue.start = start;

      delete changedValue.startDate;
      delete changedValue.startTime;
    }

    if (changedValue.endDate !== undefined || changedValue.endTime !== undefined) {
      const endDate = this.sailForm.controls.endDate.value;
      const endTime = this.sailForm.controls.endTime.value;

      const end = this.buildDate(endDate, endTime);
      changedValue.end = end;

      delete changedValue.endDate;
      delete changedValue.endTime;
    }

    this.sailForm.markAsPristine();
    this.sailForm.markAsUntouched();
    this.dispatchAction(updateSail({ id: this.sailId, sail: changedValue }));
  }

}
