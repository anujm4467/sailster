import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructionsListComponent } from './instructions-list.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ImageListModule } from '../image-list/image-list.module';

@NgModule({
  declarations: [
    InstructionsListComponent,
  ],
  exports: [
    InstructionsListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ImageListModule,
  ]
})
export class InstructionsListModule { }
