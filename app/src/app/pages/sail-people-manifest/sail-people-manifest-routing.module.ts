import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { SailPeopleManifestEditPageComponent } from './sail-people-manifest-edit-page/sail-people-manifest-edit-page.component';
import { SailPeopleManifestViewPageComponent } from './sail-people-manifest-view-page/sail-people-manifest-view-page.component';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_SAIL_PEOPLE_MANIFEST}/:checklistId`,
    component: SailPeopleManifestViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_SAIL_PEOPLE_MANIFEST}/:checklistId`,
    component: SailPeopleManifestEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailPeopleManifestRoutingModule { }
