import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesTable } from './attributes-table';

describe('AttributesTable', () => {
  let component: AttributesTable;
  let fixture: ComponentFixture<AttributesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesTable],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributesTable);
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
