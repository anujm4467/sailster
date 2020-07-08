import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '../table/table.module';
import { PositionViewComponent } from './position-view.component';

@NgModule({
  declarations: [
    PositionViewComponent,
  ],
  exports: [
    PositionViewComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
  ]
})
export class PositionViewModule { }
