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
import {
  ISailPath,
  SAIL_PATH_PROPS,
} from '../../../../../../api/src/shared/sail-path/sail-path.interface';
import { SailPathsState } from '../../../models/sail-paths.state';
import { recordSailPathRoute } from '../../../routes/routes';
import { updateSailPath } from '../../../store/actions/sail-path.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-path-edit-page',
  templateUrl: './sail-path-edit-page.component.html',
  styleUrls: ['./sail-path-edit-page.component.css']
})
export class SailPathEditPageComponent extends BasePageComponent implements OnInit {

  public form: FormGroup;
  private sailPath: ISailPath;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_PATHS, (sailPathsState: SailPathsState) => {
      this.sailPath = sailPathsState.sailPaths[this.sailPathId];

      if (this.sailPath) {
        this.updateForm();
      }
    });
  }

  private updateForm(): void {
    this.form.controls[SAIL_PATH_PROPS.DESCRIPTION].patchValue(this.sailPath.description);
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      [SAIL_PATH_PROPS.DESCRIPTION]: this.fb.control(undefined),
    });

    this.form
      .get(SAIL_PATH_PROPS.DESCRIPTION)
      .valueChanges
      .subscribe((changes) => {
        const value = (changes || '').trim();
        if (!value) {
          this.form
            .get(SAIL_PATH_PROPS.DESCRIPTION)
            .markAsPristine();
        }
      });
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.form && this.form.dirty;
  }

  public submitForm(): void {
    const description = this.form.get(SAIL_PATH_PROPS.DESCRIPTION).value;
    const sailPath: ISailPath = {
      description,
    };

    this.dispatchAction(updateSailPath({ sailPath, sailPathId: this.sailPathId, notify: true }));
  }

  public get title(): string {
    return 'Edit Sail Path Form';
  }

  public get sailPathId(): string {
    return this.route.snapshot.params.sailPathId;
  }

  public recordSailPath(): void {
    this.goTo([recordSailPathRoute(this.sailPathId)]);
  }
}
