import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CatalogsPage } from './catalogs-page';

describe('CatalogsPage', () => {
  let component: CatalogsPage;
  let fixture: ComponentFixture<CatalogsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
