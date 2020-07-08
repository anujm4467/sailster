import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '../table/table.module';
import { ManifestViewComponent } from './manifest-view.component';

@NgModule({
  declarations: [
    ManifestViewComponent,
  ],
  exports: [
    ManifestViewComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
  ]
})
export class ManifestViewModule { }
