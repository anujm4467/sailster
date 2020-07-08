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
  selector: 'app-sail-passengers-edit-page',
  templateUrl: './sail-passengers-edit-page.component.html',
  styleUrls: ['./sail-passengers-edit-page.component.css']
})
export class SailPassengersEditPageComponent extends BasePageComponent implements OnInit {

  private filterText = '';
  public availablePassengers: IProfile[] = [];
  public filteredAvailablePassengers: IProfile[] = [];
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
        this.updateForm(sail.passengers);
        if (!this.availablePassengers || !this.availablePassengers.length) {
          this.fetchAvailablePassengers();
        }
      }

    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
  }

  public filterListener(filter: string): void {
    this.filterText = filter;
    this.filterPassengers(filter);
  }

  private filterPassengers(filter: string): void {
    if (!filter) {
      this.filteredAvailablePassengers = this.availablePassengers;
    } else {
      this.filteredAvailablePassengers = this.availablePassengers
        .filter(passenger => passenger.name.includes(filter) || passenger.email.includes(filter));
    }
  }
  private buildForm(): void {
    this.sailForm = this.fb.group({
      passengers: this.fb.control([]),
    });
  }

  private updateForm(passengers: string[] = []): void {
    this.sailForm.controls.passengers.setValue(passengers || []);
    this.sailForm.markAsUntouched();
    this.sailForm.markAsPristine();
  }

  public get sailId(): string {
    return this.route.snapshot.params.id;
  }

  public get title(): string {
    return 'Edit Sail Passengers Form';
  }

  public get subtitle(): string {
    return `For sail: ${(this.sail || {}).name}`;
  }

  public get sail(): ISail {
    return this.sails[this.sailId];
  }

  public getPassengerName(passengerId: string): string {
    const profile = this.getProfile(passengerId);

    return (profile || {}).name;
  }

  public get passengerNames(): string[] {
    const currentPassengers: string[] = this.sailForm.controls.passengers.value;
    const names = currentPassengers.map(id => (this.getProfile(id) || { name: 'cannot resolve' }).name);

    return names;
  }

  public addSailPassenger(id?: string): void {
    const currentPassengers: string[] = this.sailForm.controls.passengers.value;

    currentPassengers.push(id);

    this.sailForm.controls.passengers.setValue(currentPassengers);
    this.sailForm.controls.passengers.markAsDirty();
    this.sailForm.controls.passengers.markAsTouched();

    this.availablePassengers = this.availablePassengers.filter(passenger => passenger.id !== id);
    this.filterPassengers(this.filterText);
  }

  public removeSailPassenger(id?: string): void {
    let currentPassengers: string[] = this.sailForm.controls.passengers.value as string[];

    currentPassengers = currentPassengers.filter(passengerId => passengerId !== id);

    this.sailForm.controls.passengers.setValue(currentPassengers);
    this.sailForm.controls.passengers.markAsDirty();
    this.sailForm.controls.passengers.markAsTouched();

    this.availablePassengers.splice(0, 0, this.getProfile(id));
    this.filterPassengers(this.filterText);
  }

  private fetchAvailablePassengers(): void {
    if (!this.sail) {
      return;
    }

    const startDate: Date = new Date(this.sail.start);
    const endDate: Date = new Date(this.sail.end);

    this.sailsService
      .fetchAvailableMembers(startDate.toISOString(), endDate.toISOString())
      .pipe(takeWhile(() => this.active))
      .subscribe((availablePassengers) => {
        this.availablePassengers = availablePassengers;
        this.filterPassengers(this.filterText);
        this.dispatchAction(putProfiles({ profiles: availablePassengers }));
      });
  }

  public get shoulEnableSubmitButton(): boolean {
    return !!this.sailForm && this.sailForm.dirty;
  }

  public submitForm(): void {
    const passengers: string[] = this.sailForm.controls.passengers.value;
    const sail: ISail = {
      passengers: passengers || null,
    };

    this.dispatchAction(updateSail({ sail, id: this.sailId }));
  }
}
