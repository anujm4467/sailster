import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SAIL_REQUEST_STATUS } from '../../../../../../api/src/shared/sail-request/sail-request-status';
import {
  ISailRequest,
  SAIL_REQUEST_PROPS,
} from '../../../../../../api/src/shared/sail-request/sail-request.interface';
import { MomentService } from '../../../services/moment.service';
import {
  cancelSailRequest,
  createSailRequest,
  expireSailRequest,
  scheduleSailRequest,
  updateSailRequest,
} from '../../../store/actions/sail-request.actions';
import { STORE_SLICES } from '../../../store/store';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-edit-page',
  templateUrl: './sail-request-edit-page.component.html',
  styleUrls: ['./sail-request-edit-page.component.css']
})
export class SailRequestEditPageComponent extends SailRequestBasePageComponent implements OnInit {

  public form: FormGroup;
  public requestStatusValues = Object.values(SAIL_REQUEST_STATUS);

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    super.ngOnInit();
    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_REQUESTS, () => {
      const sailRequest = this.sailRequest;

      if (sailRequest) {
        this.updateForm(sailRequest);
      }
    });

  }

  public get title(): string {
    return this.sailRequestId ? 'Edit Sail Request Form' : 'New Sail Request Form';
  }

  public get shouldShowControls(): boolean {
    return !!this.sailRequestId;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      [SAIL_REQUEST_PROPS.BY]: this.fb.control(this.user.profile.id, Validators.required),
      [SAIL_REQUEST_PROPS.DESCRIPTION]: this.fb.control(undefined, Validators.required),
      [SAIL_REQUEST_PROPS.END]: this.fb.control(this.momentService.yyyymmdd(new Date()), Validators.required),
      [SAIL_REQUEST_PROPS.START]: this.fb.control(this.momentService.yyyymmdd(new Date()), Validators.required),
      [SAIL_REQUEST_PROPS.STATUS]: this.fb
        .control({ value: SAIL_REQUEST_STATUS.NEW, disabled: this.creating }, Validators.required),
    });
  }

  private updateForm(sailRequest: ISailRequest): void {
    this.form.patchValue(sailRequest);
    this.form.controls[SAIL_REQUEST_PROPS.START].setValue(this.momentService.yyyymmdd(sailRequest[SAIL_REQUEST_PROPS.START]));
    this.form.controls[SAIL_REQUEST_PROPS.END].setValue(this.momentService.yyyymmdd(sailRequest[SAIL_REQUEST_PROPS.END]));
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  public get shouldDisableUpdateButton(): boolean {
    const should = !this.form
      || !this.form.valid
      || !this.form.dirty;

    return !!should;
  }

  public get shouldDisableCreateButton(): boolean {
    const should = !this.form || !this.form.valid || !this.form.dirty;

    return should;
  }

  public get creating(): boolean {
    return !this.sailRequestId;
  }

  public create(): void {
    const data: ISailRequest = this.form.getRawValue();

    const formStartDate = data.start.toString().split('-');
    const formEndDate = data.end.toString().split('-');
    const startDate = new Date();
    const endDate = new Date();

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    startDate.setFullYear(+formStartDate[0]);
    startDate.setMonth(+formStartDate[1] - 1);
    startDate.setDate(+formStartDate[2]);

    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    endDate.setFullYear(+formEndDate[0]);
    endDate.setMonth(+formEndDate[1] - 1);
    endDate.setDate(+formEndDate[2]);

    data.start = startDate;
    data.end = endDate;

    this.dispatchAction(createSailRequest({ sailRequest: data }));
  }

  public update(): void {
    const formControls = this.form.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          const value = formControls[key].value;

          if (typeof value === 'string') {
            red[key] = value.trim();
          } else {
            red[key] = value ? value : null;
          }

          return red;
        },
        {}
      ) as any;

    if (changedValue.start) {
      changedValue.start = new Date(changedValue.start);
    }

    if (changedValue.end) {
      changedValue.end = new Date(changedValue.end);
    }

    this.dispatchAction(updateSailRequest({ id: this.sailRequestId, sailRequest: changedValue }));
  }

  public cancelRequest(): void {
    this.dispatchAction(cancelSailRequest({ id: this.sailRequestId }));
  }

  public scheduleRequest(): void {
    this.dispatchAction(scheduleSailRequest({ id: this.sailRequestId }));
  }

  public expireRequest(): void {
    this.dispatchAction(expireSailRequest({ id: this.sailRequestId }));
  }
}
