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
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { NewCommentFormModule } from '../../components/new-comment-form/new-comment-form.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ChallengeEditPageComponent } from './challenge-edit-page/challenge-edit-page.component';
import { ChallengeListPageComponent } from './challenge-list-page/challenge-list-page.component';
import { ChallengeRoutingModule } from './challenge-routing.module';
import { ChallengeViewPageComponent } from './challenge-view-page/challenge-view-page.component';

@NgModule({
  declarations: [
    ChallengeEditPageComponent,
    ChallengeViewPageComponent,
    ChallengeListPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    ChallengeRoutingModule,
    CommentListModule,
    CommonModule,
    DatePickerModule,
    FileSelectModule,
    FormErrorsModule,
    FormsModule,
    ImageFormModule,
    ImageListModule,
    NewCommentFormModule,
    PipesModule,
    ProfileBulletModule,
    ReactiveFormsModule,
  ]
})
export class ChallengeModule { }
