import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { SailPathEditPageComponent } from './sail-path-edit-page/sail-path-edit-page.component';
import { SailPathListPageComponent } from './sail-path-list-page/sail-path-list-page.component';
import { SailPathRecordPageComponent } from './sail-path-record-page/sail-path-record-page.component';
import { SailPathViewPageComponent } from './sail-path-view-page/sail-path-view-page.component';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_SAIL_PATH}/:sailPathId`,
    component: SailPathViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.LIST_SAIL_PATHS}/:sailId`,
    component: SailPathListPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_PATH}/:sailPathId`,
    component: SailPathEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.RECORD_SAIL_PATH}/:sailPathId`,
    component: SailPathRecordPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailPathRoutingModule { }
