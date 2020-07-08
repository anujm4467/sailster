import {
  Component,
  Inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import {
  IPerson,
  PERSON_TYPE,
} from '../../../../../../api/src/shared/sail-checklist/person.interface';
import {
  maintenanceRoute,
  sailChecklistsRoute,
} from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-departure-page',
  templateUrl: './departure-page.component.html',
  styleUrls: ['./departure-page.component.css']
})
export class DeparturePageComponent extends SailChecklistBasePageComponent {

  public showNewGuestForm = false;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) fb: FormBuilder,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, fb, dialog);
  }

  public goToMaintenance(): void {
    this.goTo(
      [maintenanceRoute],
      {
        queryParams: { boatId: this.checklist.boat },
      }
    );
  }

  public goToPreviousChecklists(): void {
    this.goTo(
      [sailChecklistsRoute],
      {
        queryParams: { boatId: this.checklist.boat, excludeChecklistId: this.checklist.id },
      }
    );
  }

  public cancelNewGuest(): void {
    this.showNewGuestForm = false;
  }

  public addGuest(): void {
    this.showNewGuestForm = true;
  }

  public addNewGuest(guest: IPerson): void {
    const formManifest = this.checklistForm.controls.peopleManifest as FormArray;

    formManifest.push(this.formBuilder.group({
      guestOf: this.formBuilder.control(guest.guestOf, Validators.required),
      name: this.formBuilder.control(guest.name, Validators.required),
      personType: this.formBuilder.control(PERSON_TYPE.GUEST),
      present: this.formBuilder.control(false),
      profile: this.formBuilder.control(undefined),
    }));

    formManifest.updateValueAndValidity();
    formManifest.markAsDirty();

    this.checklistForm.updateValueAndValidity();

    this.showNewGuestForm = false;
  }

  public removeGuest(index: number): void {
    const formManifest = this.checklistForm.controls.peopleManifest as FormArray;

    formManifest.removeAt(index);

    formManifest.updateValueAndValidity();
    formManifest.markAsDirty();

    this.checklistForm.updateValueAndValidity();
  }

}
