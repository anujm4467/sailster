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
import { IInstruction } from '../../../../../../api/src/shared/instructions/instruction.interface';
import { INSTRUCTIONS } from '../../../../../../api/src/shared/instructions/instructions';
import { IInstructions } from '../../../../../../api/src/shared/instructions/instructions.interface';
import { InstructionsMap } from '../../../models/instructions-state.interface';
import { editBoatInstructionsRoute } from '../../../routes/routes';
import { fetchInstructionByBoat } from '../../../store/actions/instructions.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-instructions-base-page',
  template: ''
})
export class BoatInstructionsBasePageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.INSTRUCTIONS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);

    if (!this.boatInstructions && this.boatId) {
      this.dispatchAction(fetchInstructionByBoat({ boatId: this.boatId }));
    }
  }

  public get boatInstructions(): InstructionsMap {
    const instructions = this.instructions[this.boatId];

    return instructions;
  }

  public get boatId(): string {
    return this.route.snapshot.params.id;
  }

  public get boatName(): string {
    const boat = this.boats[this.boatId];
    const boatName = boat ? boat.name : '';

    return boatName;
  }

  public get title(): string {
    return `Boat Instructions for ${this.boatName}`;
  }

  public get departure(): IInstructions {
    return (this.boatInstructions || {})[INSTRUCTIONS.DEPARTURE];
  }

  public get arrival(): IInstructions {
    return (this.boatInstructions || {})[INSTRUCTIONS.ARRIVAL];
  }

  public get departureInstructions(): IInstruction[] {
    const instructions = this.departure || {};
    return instructions.instructions || [];
  }

  public get arrivalInstructions(): IInstruction[] {
    const instructions = this.arrival || {};
    return instructions.instructions || [];
  }

  public goToBoatInstructions(): void {
    this.goTo([editBoatInstructionsRoute(this.boatId)]);
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access.editBoat;
  }

}
