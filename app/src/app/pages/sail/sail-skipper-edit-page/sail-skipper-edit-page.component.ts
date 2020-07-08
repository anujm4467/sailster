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
  selector: 'app-sail-skipper-edit-page',
  templateUrl: './sail-skipper-edit-page.component.html',
  styleUrls: ['./sail-skipper-edit-page.component.css']
})
export class SailSkipperEditPageComponent extends BasePageComponent implements OnInit {

  private filterText = '';
  public availableSkippers: IProfile[] = [];
  public filteredAvailableSkippers: IProfile[] = [];
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
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, (sailState: ISailState) => {
      const sail = sailState.all[this.sailId];

      if (sail) {
        this.updateForm(sail.skipper);
        if (!this.availableSkippers || !this.availableSkippers.length) {
          this.fetchAvailableSkippers();
        }
      }

    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
  }

  public filterListener(filter: string): void {
    this.filterText = filter;
    this.filterSkippers(filter);
  }

  private filterSkippers(filter: string): void {
    if (!filter) {
      this.filteredAvailableSkippers = this.availableSkippers;
    } else {
      this.filteredAvailableSkippers = this.availableSkippers
        .filter(skipper => skipper.name.includes(filter) || skipper.email.includes(filter));
    }
  }
  private buildForm(): void {
    this.sailForm = this.fb.group({
      skipper: this.fb.control(undefined),
    });
  }

  private updateForm(skipper: string): void {
    this.sailForm.get('skipper').patchValue(skipper);
    this.sailForm.markAsUntouched();
    this.sailForm.markAsPristine();
  }

  public get sailId(): string {
    return this.route.snapshot.params.id;
  }

  public get title(): string {
    return 'Edit Sail Skipper Form';
  }

  public get subtitle(): string {
    return `For sail: ${(this.sail || {}).name}`;
  }

  public get sail(): ISail {
    return this.sails[this.sailId];
  }

  public get skipperName(): string {
    const skipperId = this.sailForm.controls.skipper.value;

    if (!skipperId) {
      return;
    }

    const profile = this.getProfile(skipperId);

    return (profile || {}).name;
  }

  public setSailSkipper(id?: string): void {
    const currentSkipper = this.sailForm.get('skipper').value;

    if (currentSkipper) {
      const profile = this.getProfile(currentSkipper);
      this.availableSkippers.splice(0, 0, profile);
    }

    if (id) {
      this.availableSkippers = this.availableSkippers.filter(skipper => skipper.id !== id);
    }

    this.sailForm.controls.skipper.setValue(id || null);
    this.sailForm.controls.skipper.markAsDirty();
    this.sailForm.controls.skipper.markAsTouched();

    this.filterSkippers(this.filterText);
  }

  private fetchAvailableSkippers(): void {
    if (!this.sail) {
      return;
    }

    const startDate: Date = new Date(this.sail.start);
    const endDate: Date = new Date(this.sail.end);

    this.sailsService
      .fetchAvailableSkippers(startDate.toISOString(), endDate.toISOString())
      .pipe(takeWhile(() => this.active))
      .subscribe((availableSkippers) => {
        this.availableSkippers = availableSkippers;
        this.filterSkippers(this.filterText);
        this.dispatchAction(putProfiles({ profiles: availableSkippers }));
      });
  }

  public get shoulEnableSubmitButton(): boolean {
    return !!this.sailForm && this.sailForm.dirty;
  }

  public submitForm(): void {
    const skipper = this.sailForm.get('skipper').value;
    const sail: ISail = {
      skipper: skipper || null,
    };

    this.dispatchAction(updateSail({ sail, id: this.sailId }));
  }
}
