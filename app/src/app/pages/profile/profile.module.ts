import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { FormErrorsModule } from '../../components/form-errors/form-errors.module';
import { UserProfileModule } from '../../components/user-profile/user-profile.module';
import { BasePageModule } from '../base-page/base-page.module';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileViewPageComponent } from './profile-view-page/profile-view-page.component';

@NgModule({
  declarations: [
    ProfileEditPageComponent,
    ProfileViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FileSelectModule,
    FormErrorsModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    UserProfileModule,
  ]
})
export class ProfileModule { }
