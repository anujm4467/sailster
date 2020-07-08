import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import {
  FormatDatePipe,
  FormatDateYYYYMMDDPipe,
  HumanDatePipe,
  HumanDateWithTimePipe,
} from './human-date.pipe';

@NgModule({
  declarations: [
    DurationPipe,
    FormatDatePipe,
    FormatDateYYYYMMDDPipe,
    HumanDatePipe,
    HumanDateWithTimePipe,
  ],
  exports: [
    DurationPipe,
    FormatDatePipe,
    FormatDateYYYYMMDDPipe,
    HumanDatePipe,
    HumanDateWithTimePipe,
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
