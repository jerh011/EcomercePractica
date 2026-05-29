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
  {
    path: 'brands',
    loadChildren: () =>
      import('@brands/brands.routes').then((m) => m.brandRoutes),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('@attributes/attributes.routes').then((m) => m.attributeRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@products/products.routes').then((m) => m.productRoutes),
  },
  {
    path: 'product-variants',
    loadChildren: () =>
      import('@product-variants/product-variants.routes').then((m) => m.productVariantsRoutes),
  },
];