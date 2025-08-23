import { Routes } from '@angular/router';

import { LoginPageComponent } from './login/login.page';

export const userAuthenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];
