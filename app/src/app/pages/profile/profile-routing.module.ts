import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { ProfileViewPageComponent } from './profile-view-page/profile-view-page.component';
import { SUB_ROUTES } from '../../routes/routes';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_PROFILE}/:id`,
    component: ProfileViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_PROFILE}/:id`,
    component: ProfileEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
