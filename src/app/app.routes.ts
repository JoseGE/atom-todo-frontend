import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./user-auth/user-auth.routes').then((m) => m.userAuthenticationRoutes)
  }
];
