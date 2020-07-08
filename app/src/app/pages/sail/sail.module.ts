import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CommentListModule } from '../../components/comment-list/comment-list.module';
import { DatePickerModule } from '../../components/date-picker/date-picker.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { FormErrorsModule } from '../../components/form-errors/form-errors.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { ItemPickerModule } from '../../components/item-picker/item-picker.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { NewCommentFormModule } from '../../components/new-comment-form/new-comment-form.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { SailListModule } from '../../components/sail-list/sail-list.module';
import { TableModule } from '../../components/table/table.module';
import { TimePickerModule } from '../../components/time-picker/time-picker.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { SailCancelPageComponent } from './sail-cancel-page/sail-cancel-page.component';
import { SailCrewEditPageComponent } from './sail-crew-edit-page/sail-crew-edit-page.component';
import { SailEditPageComponent } from './sail-edit-page/sail-edit-page.component';
import { SailListPageComponent } from './sail-list-page/sail-list-page.component';
import { SailListPerPersonPageComponent } from './sail-list-per-person-page/sail-list-per-person-page.component';
import { SailPassengersEditPageComponent } from './sail-passengers-edit-page/sail-passengers-edit-page.component';
import { SailPicturesPageComponent } from './sail-pictures-page/sail-pictures-page.component';
import { SailRoutingModule } from './sail-routing.module';
import { SailSkipperEditPageComponent } from './sail-skipper-edit-page/sail-skipper-edit-page.component';
import { SailViewPageComponent } from './sail-view-page/sail-view-page.component';

@NgModule({
  declarations: [
    SailCancelPageComponent,
    SailCrewEditPageComponent,
    SailEditPageComponent,
    SailListPageComponent,
    SailListPerPersonPageComponent,
    SailPassengersEditPageComponent,
    SailPicturesPageComponent,
    SailSkipperEditPageComponent,
    SailViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommentListModule,
    CommonModule,
    DatePickerModule,
    FileSelectModule,
    FormErrorsModule,
    FormsModule,
    IconTextModule,
    ImageFormModule,
    ImageListModule,
    ItemPickerModule,
    ListFilterModule,
    NewCommentFormModule,
    PipesModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    SailListModule,
    SailRoutingModule,
    TableModule,
    TimePickerModule,
  ]
})
export class SailModule { }
