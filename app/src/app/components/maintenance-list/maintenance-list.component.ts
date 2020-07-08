import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { IBoat } from '../../../../../api/src/shared/boat/boat.interface';
import {
  IBoatMaintenance,
  MAINTENANCE_PROPS,
} from '../../../../../api/src/shared/maintenance/maintenance.interface';
import { IProfile } from '../../../../../api/src/shared/profile/profile.interface';
import { IBoatMap } from '../../models/boat-state.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css']
})
export class MaintenanceListComponent {

  @Input() public boats: IBoatMap = {} as IBoatMap;
  @Input() public emptyMessage: string;
  @Input() public isLoading: boolean;
  @Input() public profiles: IProfileMap = {} as IProfileMap;
  @Input() public requests: IBoatMaintenance[] = [];
  @Input() public title: string;
  @Output() public boatFetcher: EventEmitter<string> = new EventEmitter();
  @Output() public clicked: EventEmitter<IBoatMaintenance> = new EventEmitter();
  @Output() public profileFetcher: EventEmitter<string> = new EventEmitter();
  @Output() public refreshRequest: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(MomentService) private momentService: MomentService
  ) { }

  public generateRequestDiscription(request: IBoatMaintenance): string {
    const boatName = this.getBoatName(request);
    const requestDate = this.humanizeDateWithTime(request.requestDate);
    const requesterName = this.getProfileName(request, MAINTENANCE_PROPS.REQUESTED_BY);
    const requestDescription = request.request;

    const description = `
    Request details for boat
    ${boatName}, by ${requesterName}, request: ${requestDescription},
    requested on ${requestDate}.
    Click to go to this maintenance request.`;

    return description;
  }

  private humanizeDateWithTime(date) {
    return this.momentService.humanizeDateWithTime(date, false);
  }

  public clickRequest(request: IBoatMaintenance) {
    this.clicked.emit(request);
  }

  public refresh() {
    this.refreshRequest.emit();
  }

  public getBoatName(request: IBoatMaintenance): string {
    const boat = this.getBoat(request);

    if (!boat) {
      return 'n/a';
    }

    return boat.name;
  }

  public getBoat(request: IBoatMaintenance): IBoat {
    const boatId = request.boat;

    if (!boatId) {
      return undefined;
    }

    const boat = this.boats[boatId];

    if (boat === undefined) {
      this.boatFetcher.emit(boatId);
    }

    return boat;
  }

  public getProfileName(request: IBoatMaintenance, fieldName: string = MAINTENANCE_PROPS.REQUESTED_BY): string {
    const profile = this.getProfile(request, fieldName);

    if (!profile) {
      return 'n/a';
    }

    return profile.name;
  }

  public getProfile(request: IBoatMaintenance, fieldName: string): IProfile {
    const profileId = request[fieldName];

    if (!profileId) {
      return undefined;
    }

    const profile = request[`${fieldName}Resoved`] || this.profiles[profileId];

    if (profile === undefined) {
      this.profileFetcher.emit(profileId);
    }

    return profile;
  }

}
