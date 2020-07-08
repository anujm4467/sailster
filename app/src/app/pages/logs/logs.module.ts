import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { PipesModule } from '../../pipes/pipes.module';
import { LogsListComponent } from './logs-list/logs-list.component';
import { LogsRoutingModule } from './logs-routing.module';
import { LogsViewComponent } from './logs-view/logs-view.component';

@NgModule({
  declarations: [
    LogsListComponent,
    LogsViewComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    LogsRoutingModule,
    PipesModule,
    ProfileBulletModule,
  ]
})
export class LogsModule { }
