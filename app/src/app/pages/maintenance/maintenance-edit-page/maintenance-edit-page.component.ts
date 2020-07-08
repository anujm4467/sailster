import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IBoat } from '../../../../../../api/src/shared/boat/boat.interface';
import { MAINTENANCE_STATUS } from '../../../../../../api/src/shared/maintenance/maintenance-status.enum';
import {
  IBoatMaintenance,
  MAINTENANCE_PROPS,
} from '../../../../../../api/src/shared/maintenance/maintenance.interface';
import { CDNService } from '../../../services/cdn.service';
import {
  createBoatMaintenance,
  updateBoatMaintenance,
} from '../../../store/actions/boat-maintenance.actions';
import {
  CDN_ACTION_STATE,
  uploadMaintenancePicture,
} from '../../../store/actions/cdn.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-edit-page',
  templateUrl: './maintenance-edit-page.component.html',
  styleUrls: ['./maintenance-edit-page.component.css']
})
export class MaintenanceEditPageComponent extends BasePageComponent implements OnInit {

  private fileToUpload: File = null;
  private pendingUploads: string[] = [];
  public creatingNewMaintenance: boolean;
  public maintenanceForm: FormGroup;
  public maintenanceId: string;
  protected maintenanceStatus = MAINTENANCE_STATUS;
  protected readonly maintenancePictureInputId = 'maintenancePictureInput';
  protected uploadProcentage: number;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(CDNService) private cdnService: CDNService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    const boatId = this.route.snapshot.queryParams.boatId;

    this.maintenanceId = this.route.snapshot.params.id;
    this.creatingNewMaintenance = !this.maintenanceId;

    this.buildForm(boatId);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN, () => {
      if (this.user) {
        this.fetchBoats(false);
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      if (!this.maintenanceForm) {
        return;
      }
      if (!this.maintenanceForm.controls.boat.value || this.maintenanceForm.controls.boat.value === 'null') {
        this.maintenanceForm.patchValue({ boat: boatId || (this.boatsArray[0] || {}).id });
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES, () => {
      const request = this.maintenance;
      if (request) {
        this.updateForm();
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn) => {
      const filesProcessed: string[] = [];

      this.pendingUploads
        .forEach((file) => {
          const fileStatus = cdn[file] || {};
          const fileInput = document.getElementById(this.maintenancePictureInputId) as HTMLInputElement;
          switch (fileStatus.state) {
            case CDN_ACTION_STATE.UPLOADED:
              filesProcessed.push(file);
              this.createNewPictureForm(fileStatus.url);
              this.fileToUpload = null;
              if (fileInput) {
                fileInput.value = null;
              }
              break;
            case CDN_ACTION_STATE.ERROR:
              this.fileToUpload = null;
              if (fileInput) {
                fileInput.value = null;
              }
              break;
          }
        });

      this.pendingUploads = this.pendingUploads.filter(url => !filesProcessed.includes(url));
    });
  }

  protected get isServiceDetailsRequired(): boolean {
    return this.maintenanceForm.controls.status.value === MAINTENANCE_STATUS.RESOLVED;
  }

  protected get pictureControls(): AbstractControl[] {
    if (!this.maintenanceForm) {
      return [];
    }

    return (this.maintenanceForm.controls.pictures as FormArray).controls;
  }

  protected get uploadProgress(): number {
    return this.fileToUpload ? this.cdn[this.fileToUpload.name].progress : 0;
  }

  protected deletePicture(index: number): void {
    const existingPictures: AbstractControl[] = (this.maintenanceForm.controls.pictures as FormArray).controls;
    const url = existingPictures[index].value.url;

    if (url && url.startsWith('cdn/')) {
      this.cdnService
        .deleteFile(url)
        .subscribe(() => {
          existingPictures.splice(index, 1);
          this.maintenanceForm.markAsDirty();
          this.maintenanceForm.controls.pictures.markAsDirty();
          this.maintenanceForm.controls.pictures.markAsTouched();
          this.maintenanceForm.controls.pictures.updateValueAndValidity();
        });
    } else {
      existingPictures.splice(index, 1);
      this.maintenanceForm.markAsDirty();
      this.maintenanceForm.controls.pictures.markAsDirty();
      this.maintenanceForm.controls.pictures.markAsTouched();
      this.maintenanceForm.controls.pictures.updateValueAndValidity();
    }
  }

  private createNewPictureForm(filePath: string): void {
    const newPicture = this.fb.group({
      comment: this.fb.control(undefined),
      url: this.fb.control(filePath),
    });

    const existingPictures: FormArray = this.maintenanceForm.controls.pictures as FormArray;

    existingPictures.push(newPicture);

    existingPictures.markAsDirty();
    this.maintenanceForm.markAsDirty();
  }

  protected uploadFileToCDN(files: File[]): void {
    this.fileToUpload = files[0];
    this.pendingUploads.push(files[0].name);
    this.dispatchAction(uploadMaintenancePicture({ file: files[0] }));
  }

  private updateForm(): void {
    const request = this.maintenance;
    this.maintenanceForm.patchValue(request);

    const pictures = (this.maintenanceForm.controls.pictures as FormArray);

    while (pictures.length) {
      pictures.removeAt(0);
    }

    request.pictures.forEach((pic) => {
      pictures.push(this.fb.group(pic));
    });

    this.maintenanceForm.markAsUntouched();
    this.maintenanceForm.markAsPristine();
  }

  protected get maintenance(): IBoatMaintenance {
    if (!this.maintenanceId) {
      return;
    }
    const request = this.maintenances[this.maintenanceId];
    if (!request && request !== null) {
      this.fetchBoatMaintenance(this.maintenanceId, false);
    }

    return request;
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.maintenanceForm && this.maintenanceForm.valid && this.maintenanceForm.dirty;
  }

  private buildForm(boatId?: string): void {
    this.maintenanceForm = this.fb.group({
      [MAINTENANCE_PROPS.BOAT]: this.fb.control(boatId, Validators.required),
      [MAINTENANCE_PROPS.REQUEST]: this.fb.control(undefined, Validators.required),
      [MAINTENANCE_PROPS.PICTURES]: this.fb.array([]),
      [MAINTENANCE_PROPS.STATUS]: this.fb.control({ value: MAINTENANCE_STATUS.NEW, disabled: !this.maintenanceId }),
      [MAINTENANCE_PROPS.SERVICE_DETAILS]: this.fb.control({ value: undefined, disabled: !this.maintenanceId }),
    });
  }

  public get title(): string {
    return this.creatingNewMaintenance ? 'New Maintenance Request Form' : 'Edit Maintenace Request Form';
  }

  protected submitForm(): void {
    if (this.creatingNewMaintenance) {
      const maintenanceData: IBoatMaintenance = this.maintenanceForm.getRawValue();
      maintenanceData.requestDate = new Date();
      maintenanceData.requestedBy = this.user.profile.id;
      maintenanceData.status = MAINTENANCE_STATUS.NEW;
      this.dispatchAction(createBoatMaintenance({ maintenance: maintenanceData, notify: true }));
    } else {
      const changedValues: IBoatMaintenance = Object
        .keys(this.maintenanceForm.controls)
        .filter(controlName => !this.maintenanceForm.controls[controlName].pristine)
        .reduce(
          (red, controlName) => {
            red[controlName] = this.maintenanceForm.controls[controlName].value;
            return red;
          },
          {});
      this.dispatchAction(updateBoatMaintenance({ id: this.maintenanceId, maintenance: changedValues, notify: true }));
    }
  }

  protected compareBoats(a: IBoat, b: IBoat): boolean {
    return a.id === b.id;
  }

}
