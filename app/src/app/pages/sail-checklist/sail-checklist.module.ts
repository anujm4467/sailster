import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ChecklistFormModule } from '../../components/checklist-form/checklist-form.module';
import { ChecklistSummaryModule } from '../../components/checklist-summary/checklist-summary.module';
import { ChecklistViewModule } from '../../components/checklist-view/checklist-view.module';
import { FormErrorsModule } from '../../components/form-errors/form-errors.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { InstructionsListModule } from '../../components/instructions-list/instructions-list.module';
import { ManifestEditModule } from '../../components/manifest-edit/manifest-edit.module';
import { TableModule } from '../../components/table/table.module';
import { BasePageModule } from '../base-page/base-page.module';
import { ArrivalPageComponent } from './arrival-page/arrival-page.component';
import { DeparturePageComponent } from './departure-page/departure-page.component';
import { SailChecklistBasePageComponent } from './sail-checklist-base-page/sail-checklist-base-page';
import { SailChecklistEditPageComponent } from './sail-checklist-edit-page/sail-checklist-edit-page.component';
import { SailChecklistListPageComponent } from './sail-checklist-list-page/sail-checklist-list-page.component';
import { SailChecklistRoutingModule } from './sail-checklist-routing.module';
import { SailChecklistViewPageComponent } from './sail-checklist-view-page/sail-checklist-view-page.component';

@NgModule({
  declarations: [
    ArrivalPageComponent,
    DeparturePageComponent,
    SailChecklistBasePageComponent,
    SailChecklistEditPageComponent,
    SailChecklistListPageComponent,
    SailChecklistViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    ChecklistFormModule,
    ChecklistSummaryModule,
    ChecklistViewModule,
    CommonModule,
    FormErrorsModule,
    FormsModule,
    IconTextModule,
    InstructionsListModule,
    ManifestEditModule,
    ReactiveFormsModule,
    SailChecklistRoutingModule,
    TableModule,
  ]
})
export class SailChecklistModule { }
