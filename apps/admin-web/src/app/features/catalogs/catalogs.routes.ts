import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@catalogs/pages/catalogs-page/catalogs-page').then(
        (m) => m.CatalogsPage,
      ),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('@categories/categories.routes').then((m) => m.categoriesRoutes),
  },
];