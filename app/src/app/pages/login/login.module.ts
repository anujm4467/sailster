import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { LoginPageComponent } from './login-page.component';
import { LoginRoutingModule } from './login-routing.module';
import { BasePageModule } from '../base-page/base-page.module';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
