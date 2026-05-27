import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'catalogs',
  },
  {
    path: '',
    loadComponent: () =>
      import('@core/layouts/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'catalogs',
        loadChildren: () =>
          import('@catalogs/catalogs.routes').then((m) => m.catalogRoutes),
      },
      
    ],
  },
];
