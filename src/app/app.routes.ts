import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./features/users/users-page.component').then((m) => m.UsersPageComponent),
  },
  { path: '**', redirectTo: 'usuarios' },
];
