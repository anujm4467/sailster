import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormErrorsModule } from '../../components/form-errors/form-errors.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { TableModule } from '../../components/table/table.module';
import { ClinicEditEnrollmentPageComponent } from './clinic-edit-enrollment-page/clinic-edit-enrollment-page.component';
import { ClinicEditPageComponent } from './clinic-edit-page/clinic-edit-page.component';
import { ClinicListPageComponent } from './clinic-list-page/clinic-list-page.component';
import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicViewPageComponent } from './clinic-view-page/clinic-view-page.component';

@NgModule({
  declarations: [
    ClinicEditEnrollmentPageComponent,
    ClinicEditPageComponent,
    ClinicListPageComponent,
    ClinicViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    ClinicRoutingModule,
    CommonModule,
    FormErrorsModule,
    FormsModule,
    IconTextModule,
    ListFilterModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class ClinicModule { }
