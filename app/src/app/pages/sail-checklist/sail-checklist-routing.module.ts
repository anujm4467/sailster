import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { ArrivalPageComponent } from './arrival-page/arrival-page.component';
import { DeparturePageComponent } from './departure-page/departure-page.component';
import { SailChecklistEditPageComponent } from './sail-checklist-edit-page/sail-checklist-edit-page.component';
import { SailChecklistListPageComponent } from './sail-checklist-list-page/sail-checklist-list-page.component';
import { SailChecklistViewPageComponent } from './sail-checklist-view-page/sail-checklist-view-page.component';

const routes: Routes = [
  {
    path: '',
    component: SailChecklistListPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_SAIL_CHECKLIST}/:id`,
    component: SailChecklistViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_CHECKLIST}/:id`,
    component: SailChecklistEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.DEPARTURE_SAIL_CHECKLIST}/:id`,
    component: DeparturePageComponent,
  },
  {
    path: `${SUB_ROUTES.ARRIVAL_SAIL_CHECKLIST}/:id`,
    component: ArrivalPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailChecklistRoutingModule { }
