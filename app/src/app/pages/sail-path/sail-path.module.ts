import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { PositionViewModule } from '../../components/position-view/position-view.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { TableModule } from '../../components/table/table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SailPathEditPageComponent } from './sail-path-edit-page/sail-path-edit-page.component';
import { SailPathListPageComponent } from './sail-path-list-page/sail-path-list-page.component';
import { SailPathRecordPageComponent } from './sail-path-record-page/sail-path-record-page.component';
import { SailPathRoutingModule } from './sail-path-routing.module';
import { SailPathViewPageComponent } from './sail-path-view-page/sail-path-view-page.component';

@NgModule({
  declarations: [
    SailPathEditPageComponent,
    SailPathListPageComponent,
    SailPathRecordPageComponent,
    SailPathViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    PipesModule,
    PositionViewModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    SailPathRoutingModule,
    TableModule,
  ]
})
export class SailPathModule { }
