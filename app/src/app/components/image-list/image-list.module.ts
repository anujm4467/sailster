import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ImageListComponent } from './image-list.component';

@NgModule({
  declarations: [
    ImageListComponent,
  ],
  exports: [
    ImageListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule
  ]
})
export class ImageListModule { }
