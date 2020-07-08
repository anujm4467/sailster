import { takeWhile } from 'rxjs/operators';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IProfile } from '../../../../../../api/src/shared/profile/profile.interface';
import { ISail } from '../../../../../../api/src/shared/sail/sail.interface';
import { ISailState } from '../../../models/sail-state.interface';
import { SailService } from '../../../services/sail.service';
import { putProfiles } from '../../../store/actions/profile.actions';
import { updateSail } from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-crew-edit-page',
  templateUrl: './sail-crew-edit-page.component.html',
  styleUrls: ['./sail-crew-edit-page.component.css']
})
export class SailCrewEditPageComponent extends BasePageComponent implements OnInit {

  private filterText = '';
  public availableCrew: IProfile[] = [];
  public filteredAvailableCrew: IProfile[] = [];
  public sailForm: FormGroup;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(SailService) private sailsService: SailService,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit(): void {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, (sailState: ISailState) => {
      const sail = sailState.all[this.sailId];

      if (sail) {
        this.updateForm(sail.crew);
        if (!this.availableCrew || !this.availableCrew.length) {
          this.fetchAvailableCrew();
        }
      }

    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
  }

  public filterListener(filter: string): void {
    this.filterText = filter;
    this.filterCrew(filter);
  }

  private filterCrew(filter: string): void {
    if (!filter) {
      this.filteredAvailableCrew = this.availableCrew;
    } else {
      this.filteredAvailableCrew = this.availableCrew
        .filter(crew => crew.name.includes(filter) || crew.email.includes(filter));
    }
  }

  private buildForm(): void {
    this.sailForm = this.fb.group({
      crew: this.fb.control(undefined),
    });
  }

  private updateForm(crew: string): void {
    this.sailForm.get('crew').patchValue(crew);
    this.sailForm.markAsUntouched();
    this.sailForm.markAsPristine();
  }

  public get sailId(): string {
    return this.route.snapshot.params.id;
  }

  public get title(): string {
    return 'Edit Sail Crew Form';
  }

  public get subtitle(): string {
    return `For sail: ${(this.sail || {}).name}`;
  }

  public get sail(): ISail {
    return this.sails[this.sailId];
  }

  public get crewName(): string {
    const crewId = this.sailForm.controls.crew.value;

    if (!crewId) {
      return;
    }

    const profile = this.getProfile(crewId);

    return (profile || {}).name;
  }

  public setSailCrew(id?: string): void {
    const currentCrew = this.sailForm.get('crew').value;

    if (currentCrew) {
      const profile = this.getProfile(currentCrew);
      if (profile) {
        this.availableCrew.splice(0, 0, profile);
      }
    }

    if (id) {
      this.availableCrew = this.availableCrew.filter(crew => crew.id !== id);
    }

    this.sailForm.controls.crew.setValue(id || null);
    this.sailForm.controls.crew.markAsDirty();
    this.sailForm.controls.crew.markAsTouched();

    this.filterCrew(this.filterText);
  }

  private fetchAvailableCrew(): void {
    if (!this.sail) {
      return;
    }

    const startDate: Date = new Date(this.sail.start);
    const endDate: Date = new Date(this.sail.end);

    this.sailsService
      .fetchAvailableCrew(startDate.toISOString(), endDate.toISOString())
      .pipe(takeWhile(() => this.active))
      .subscribe((availableCrew) => {
        this.availableCrew = availableCrew;
        this.filterCrew(this.filterText);
        this.dispatchAction(putProfiles({ profiles: availableCrew }));
      });
  }

  public get shoulEnableSubmitButton(): boolean {
    return !!this.sailForm && this.sailForm.dirty;
  }

  public submitForm(): void {
    const crew = this.sailForm.get('crew').value;
    const sail: ISail = {
      crew: crew || null,
    };

    this.dispatchAction(updateSail({ sail, id: this.sailId }));
  }

}
