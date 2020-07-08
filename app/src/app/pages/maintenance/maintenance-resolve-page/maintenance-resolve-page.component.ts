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
import { MAINTENANCE_STATUS } from '../../../../../../api/src/shared/maintenance/maintenance-status.enum';
import {
  IBoatMaintenance,
  MAINTENANCE_PROPS,
} from '../../../../../../api/src/shared/maintenance/maintenance.interface';
import { updateBoatMaintenance } from '../../../store/actions/boat-maintenance.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-resolve-page',
  templateUrl: './maintenance-resolve-page.component.html',
  styleUrls: ['./maintenance-resolve-page.component.css']
})
export class MaintenanceResolvePageComponent extends BasePageComponent implements OnInit {

  public maintenanceResolveForm: FormGroup;
  public maintenanceId: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.maintenanceId = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES, () => {
      if (!this.maintenanceResolveForm) {
        this.buildForm();
      } else {
        this.updateForm();
      }
    });

  }

  private buildForm(): void {
    this.maintenanceResolveForm = this.fb.group({
      [MAINTENANCE_PROPS.SERVICE_DETAILS]: this.fb.control(this.maintenance.serviceDetails, Validators.required),
    });
  }

  private updateForm(): void {
    this.maintenanceResolveForm.controls[MAINTENANCE_PROPS.SERVICE_DETAILS].patchValue(this.maintenance.serviceDetails);
    this.maintenanceResolveForm.updateValueAndValidity();
    this.maintenanceResolveForm.markAsPristine();
  }

  public get maintenance(): IBoatMaintenance {
    return this.maintenances[this.maintenanceId];
  }

  public get shouldEnableSubmit(): boolean {
    if (!this.maintenanceResolveForm) {
      return false;
    }

    return this.maintenanceResolveForm.dirty && this.maintenanceResolveForm.valid;
  }

  public submitMaintenaceResolveForm(): void {
    const maintenance: IBoatMaintenance = {
      serviceDetails: this.maintenanceResolveForm.controls.serviceDetails.value.trim(),
      servicedOn: new Date(),
      servicedBy: this.user.profile.id,
      status: MAINTENANCE_STATUS.RESOLVED,
    };

    this.dispatchAction(updateBoatMaintenance({ maintenance, id: this.maintenanceId, notify: true }));
  }

}
