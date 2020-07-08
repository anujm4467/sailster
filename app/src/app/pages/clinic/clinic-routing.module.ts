import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { ClinicEditEnrollmentPageComponent } from './clinic-edit-enrollment-page/clinic-edit-enrollment-page.component';
import { ClinicEditPageComponent } from './clinic-edit-page/clinic-edit-page.component';
import { ClinicListPageComponent } from './clinic-list-page/clinic-list-page.component';
import { ClinicViewPageComponent } from './clinic-view-page/clinic-view-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: SUB_ROUTES.LIST_CLINICS,
  },
  {
    path: `${SUB_ROUTES.VIEW_CLINIC}/:clinicId`,
    component: ClinicViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_CLINIC}/:clinicId`,
    component: ClinicEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_CLINIC_ENROLLMENT}/:clinicId`,
    component: ClinicEditEnrollmentPageComponent,
  },
  {
    path: `${SUB_ROUTES.CREATE_CLINIC}`,
    component: ClinicEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.LIST_CLINICS}`,
    component: ClinicListPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
