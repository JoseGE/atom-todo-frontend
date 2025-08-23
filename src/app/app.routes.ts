import { Routes } from '@angular/router';

import { authenticationGuard } from './shared-infra/route-protection/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./user-auth/user-auth.routes').then(
        (m) => m.userAuthenticationRoutes
      ),
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./task-management/task-management.routes').then(
        (m) => m.taskManagementRouter
      ),
    canActivate: [authenticationGuard],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
