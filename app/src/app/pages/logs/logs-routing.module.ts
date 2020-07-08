import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { LogsListComponent } from './logs-list/logs-list.component';
import { LogsViewComponent } from './logs-view/logs-view.component';

const routes: Routes = [
  {
    path: '',
    component: LogsListComponent,
  },
  {
    path: SUB_ROUTES.LIST_LOGS,
    component: LogsListComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_LOGS}/:profileId`,
    component: LogsViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule { }
