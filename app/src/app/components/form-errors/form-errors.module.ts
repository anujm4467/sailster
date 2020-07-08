import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormErrorsComponent } from './form-errors.component';

@NgModule({
  declarations: [
    FormErrorsComponent,
  ],
  exports: [
    FormErrorsComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule
  ]
})
export class FormErrorsModule { }
