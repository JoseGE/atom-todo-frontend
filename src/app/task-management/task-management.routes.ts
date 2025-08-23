import { Routes } from '@angular/router';

export const taskManagementRouter: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-listing/task-listing.component').then((m) => m.TaskListingComponent),
  },
];
