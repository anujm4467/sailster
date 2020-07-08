import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { IPosition } from '../../../../../../api/src/shared/sail-path/position.interface';
import { SnackType } from '../../../models/snack-state.interface';
import { SailPathService } from '../../../services/sail-path.service';
import { putSnack } from '../../../store/actions/snack.actions';
import { BasePageComponent } from '../../base-page/base-page.component';

export enum RECORDING_STATE {
  NOT_STARTED,
  RECORDING,
  PAUSED,
}

@Component({
  selector: 'app-sail-path-record-page',
  templateUrl: './sail-path-record-page.component.html',
  styleUrls: ['./sail-path-record-page.component.css']
})
export class SailPathRecordPageComponent extends BasePageComponent implements OnInit, OnDestroy {

  public positions = [];
  private locationDestroy;
  public sampleRate = 1;
  public recordingState: RECORDING_STATE = RECORDING_STATE.NOT_STARTED;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(SailPathService) private sailPathService: SailPathService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.loadFromLocalStorage();
    if (this.positions.length === 0) {
      this.recordingState = RECORDING_STATE.NOT_STARTED;
    } else {
      this.recordingState = RECORDING_STATE.PAUSED;
    }
  }

  ngOnDestroy() {
    this.clearLocationListener();
    super.ngOnDestroy();
  }

  public get sailPathId(): string {
    return this.route.snapshot.params.sailPathId;
  }

  public get title(): string {
    return 'Recording Sail Path';
  }

  public floor(value: number): number {
    return Math.floor(value);
  }

  public shouldEnableStartButton(): boolean {
    return this.recordingState === RECORDING_STATE.NOT_STARTED;
  }

  public shouldEnablePauseButton(): boolean {
    return this.recordingState === RECORDING_STATE.RECORDING;
  }

  public shouldEnableResumeButton(): boolean {
    return this.recordingState === RECORDING_STATE.PAUSED;
  }

  public shouldEnableDiscardButton(): boolean {
    return this.positions.length > 0 && this.recordingState !== RECORDING_STATE.RECORDING;
  }

  private clearLocationListener(): void {
    if (this.locationDestroy) {
      clearInterval(this.locationDestroy);
    }
  }

  public sampleRateChangeListener(value): void {
    if (+value === this.sampleRate) {
      return;
    }

    if (!value) {
      this.sampleRate = 1;
    } else {
      this.sampleRate = +value;
    }

    if (this.recordingState === RECORDING_STATE.RECORDING) {
      this.startLocationListener();
    }
  }

  public startRecording(): void {
    this.recordingState = RECORDING_STATE.RECORDING;
    if (navigator.geolocation) {
      this.startLocationListener();
    } else {
      alert('no navigator.geolocation');
    }
  }

  public pauseRecording(): void {
    this.recordingState = RECORDING_STATE.PAUSED;
    this.clearLocationListener();
  }

  public discardRecording(): void {
    this.recordingState = RECORDING_STATE.PAUSED;
    this.clearLocalRecordingData();
    this.dispatchAction(putSnack({ snack: { message: 'Recording discarded.', type: SnackType.INFO } }));
  }

  private clearLocalRecordingData(): void {
    const keyPrefix = `sail_path_${this.sailPathId}_`;
    Object
      .keys(localStorage)
      .filter(key => key.startsWith(keyPrefix))
      .forEach(key => localStorage.removeItem(key));

    this.positions = [];
  }

  public resumeRecording(): void {
    this.recordingState = RECORDING_STATE.RECORDING;
    if (navigator.geolocation) {
      this.startLocationListener();
    } else {
      alert('no navigator.geolocation');
    }
  }

  private loadFromLocalStorage(): void {
    const keyPrefix = `sail_path_${this.sailPathId}`;
    try {
      this.positions = Object
        .keys(localStorage)
        .filter(key => key.startsWith(keyPrefix))
        .map(key => JSON.parse(localStorage.getItem(key)))
        .sort((a: IPosition, b: IPosition) => +a.timestamp - (+b.timestamp));
    } catch (e) {
      console.error(e);
    }
  }

  private storeLocationInLocalStorage(location: string, index: number): void {
    const key = `sail_path_${this.sailPathId}_${index}`;
    try {
      localStorage.setItem(key, location);
    } catch (e) {
      console.error(e);
    }
  }

  private startLocationListener(): void {
    this.clearLocationListener();
    this.locationDestroy = setInterval(
      () => {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          const coords: Coordinates = position.coords;

          const coordsCopy = {
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed,
          };

          const locationCopy = {
            coords: coordsCopy,
            timestamp: position.timestamp,
          };

          const locationString = JSON.stringify(locationCopy);

          this.positions.push(locationCopy);
          this.storeLocationInLocalStorage(locationString, this.positions.length - 1);
        });
      },
      1000 * this.sampleRate,
    );
  }

  public submitPositions(): void {
    this.sailPathService
      .addSailPathPositions(this.sailPathId, this.positions)
      .subscribe(() => {
        this.clearLocalRecordingData();
        this.dispatchAction(putSnack({ snack: { message: 'Positions saved.', type: SnackType.INFO } }));
      });
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.positions.length > 0 && this.recordingState !== RECORDING_STATE.RECORDING;
  }
}
