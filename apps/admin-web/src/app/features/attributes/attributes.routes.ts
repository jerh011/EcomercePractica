import { Routes } from '@angular/router';

export const attributeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@attributes/pages/attributes-page/attributes-page').then(
        (m) => m.AttributesPage,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        '@attributes/pages/attribute-bulk-creator-page/attribute-bulk-creator-page'
      ).then((m) => m.AttributeBulkCreatorPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@attributes/pages/edit-attribute-page/edit-attribute-page').then(
        (m) => m.EditAttributePage,
      ),
  },
];
