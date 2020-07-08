import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { SailCancelPageComponent } from './sail-cancel-page/sail-cancel-page.component';
import { SailCrewEditPageComponent } from './sail-crew-edit-page/sail-crew-edit-page.component';
import { SailEditPageComponent } from './sail-edit-page/sail-edit-page.component';
import { SailListPageComponent } from './sail-list-page/sail-list-page.component';
import { SailListPerPersonPageComponent } from './sail-list-per-person-page/sail-list-per-person-page.component';
import { SailPassengersEditPageComponent } from './sail-passengers-edit-page/sail-passengers-edit-page.component';
import { SailPicturesPageComponent } from './sail-pictures-page/sail-pictures-page.component';
import { SailSkipperEditPageComponent } from './sail-skipper-edit-page/sail-skipper-edit-page.component';
import { SailViewPageComponent } from './sail-view-page/sail-view-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SailListPageComponent,
  },
  {
    path: SUB_ROUTES.CREATE_SAIL,
    component: SailEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL}/:id`,
    component: SailEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_SAIL}/:id`,
    component: SailViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.CANCEL_SAIL}/:id`,
    component: SailCancelPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_SKIPPER}/:id`,
    component: SailSkipperEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_CREW}/:id`,
    component: SailCrewEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_PASSENGERS}/:id`,
    component: SailPassengersEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_SAIL_PICTURES}/:id`,
    component: SailPicturesPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_SAIL_PER_PERSON}/:profileId`,
    component: SailListPerPersonPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailRoutingModule { }
