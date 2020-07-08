import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { ROOT_ROUTES } from './routes/routes';

const routes: Routes = [
  {
    path: ROOT_ROUTES.LOGIN,
    loadChildren: () => import('./pages/login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: ROOT_ROUTES.ACCOUNT_REVIEW,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/account-review/account-review.module').then(mod => mod.AccountReviewModule)
  },
  {
    path: ROOT_ROUTES.SAIL_REQUESTS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail-request/sail-request.module').then(mod => mod.SailRequestModule)
  },
  {
    path: ROOT_ROUTES.DASHBOARD,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(mod => mod.DashboardModule)
  },
  {
    path: ROOT_ROUTES.MAINTENANCE,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/maintenance/maintenance.module').then(mod => mod.MaintenanceModule)
  },
  {
    path: ROOT_ROUTES.PROFILES,
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(mod => mod.ProfileModule),
  },
  {
    path: ROOT_ROUTES.BOATS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/boat/boat.module').then(mod => mod.BoatModule)
  },
  {
    path: ROOT_ROUTES.BOAT_INSTRUCTIONS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/boat-instructions/boat-instructions.module').then(mod => mod.BoatInstructionsModule)
  },
  {
    path: ROOT_ROUTES.SAILS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail/sail.module').then(mod => mod.SailModule)
  },
  {
    path: ROOT_ROUTES.SAIL_CHECKLISTS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail-checklist/sail-checklist.module').then(mod => mod.SailChecklistModule)
  },
  {
    path: ROOT_ROUTES.REQUIRED_ACTIONS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/required-actions/required-actions.module').then(mod => mod.RequiredActionsModule)
  },
  {
    path: ROOT_ROUTES.FEEDBACK,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feedback/feedback.module').then(mod => mod.FeedbackModule)
  },
  {
    path: ROOT_ROUTES.SAIL_PATHS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/sail-path/sail-path.module').then(mod => mod.SailPathModule)
  },
  {
    path: ROOT_ROUTES.ADMIN,
    canActivate: [AdminGuard],
    loadChildren: () => import('./pages/admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: ROOT_ROUTES.LOGS,
    canActivate: [AdminGuard],
    loadChildren: () => import('./pages/logs/logs.module').then(mod => mod.LogsModule)
  },
  {
    path: ROOT_ROUTES.SAIL_PEOPLE_MANIFEST,
    canActivate: [AdminGuard],
    loadChildren: () => import('./pages/sail-people-manifest/sail-people-manifest.module').then(mod => mod.SailPeopleManifestModule)
  },
  {
    path: ROOT_ROUTES.CHALLENGES,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/challenge/challenge.module').then(mod => mod.ChallengeModule)
  },
  {
    path: ROOT_ROUTES.CLINICS,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/clinic/clinic.module').then(mod => mod.ClinicModule)
  },
  {
    path: '',
    redirectTo: ROOT_ROUTES.DASHBOARD,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
