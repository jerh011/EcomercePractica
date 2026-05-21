import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';

import { CatalogLinkCard } from './catalog-link-card';

describe('CatalogLinkCard', () => {
  let component: CatalogLinkCard;
  let fixture: ComponentFixture<CatalogLinkCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogLinkCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogLinkCard);
    fixture.componentRef.setInput('label', 'Categorias');
    fixture.componentRef.setInput('href', '/categories');
    fixture.componentRef.setInput('icon', faBoxes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
