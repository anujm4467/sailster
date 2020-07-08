import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ManifestEditModule } from '../../components/manifest-edit/manifest-edit.module';
import { ManifestViewModule } from '../../components/manifest-view/manifest-view.module';
import { TableModule } from '../../components/table/table.module';
import { SailPeopleManifestEditPageComponent } from './sail-people-manifest-edit-page/sail-people-manifest-edit-page.component';
import { SailPeopleManifestRoutingModule } from './sail-people-manifest-routing.module';
import { SailPeopleManifestViewPageComponent } from './sail-people-manifest-view-page/sail-people-manifest-view-page.component';

@NgModule({
  declarations: [
    SailPeopleManifestEditPageComponent,
    SailPeopleManifestViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    ManifestEditModule,
    ManifestViewModule,
    ReactiveFormsModule,
    SailPeopleManifestRoutingModule,
    TableModule,
  ]
})
export class SailPeopleManifestModule { }
