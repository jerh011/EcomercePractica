import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeBulkCreatorPage } from './attribute-bulk-creator-page';

describe('AttributeBulkCreatorPage', () => {
  let component: AttributeBulkCreatorPage;
  let fixture: ComponentFixture<AttributeBulkCreatorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeBulkCreatorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeBulkCreatorPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
