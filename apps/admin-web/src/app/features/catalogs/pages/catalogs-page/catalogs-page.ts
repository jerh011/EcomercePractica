import { Component } from '@angular/core';
import { PageLayout } from '@shared/component/page-layout/page-layout';
import { PageHeader } from "@shared/component/page-header/page-header";
import { CatalogLinkCard } from "@catalogs/components/catalog-link-card/catalog-link-card";
import { faBoxes, faBoxOpen, faCertificate, faLayerGroup, faListCheck, faTableCellsLarge, faTags } from '@fortawesome/free-solid-svg-icons';
import { CatalogLinkCardType } from '@catalogs/components/catalog-link-card/catalog-link-card.types';

@Component({
  selector: 'ecom-catalogs-page',
  imports: [PageLayout, PageHeader, CatalogLinkCard],
  templateUrl: './catalogs-page.html',
  styleUrl: './catalogs-page.css',
})
export class CatalogsPage {
  readonly options: CatalogLinkCardType[] = [
    {
      label: 'Categorías',
      icon: faTableCellsLarge,
      href: 'categories',
    },
    {
      label: 'Productos',
      icon: faBoxes,
      href: 'products',
    },
    {
      label: 'Marcas',
      icon: faCertificate,
      href: 'brands',
    },
    {
      label: 'Variantes de productos',
      icon: faLayerGroup,
      href: 'product-variants',
    },
    {
      label: 'Atributos',
      icon: faListCheck,
      href: 'attributes',
    },
    {
      label: 'Ofertas',
      icon: faTags,
      href: 'offers',
    },
  ];
}
