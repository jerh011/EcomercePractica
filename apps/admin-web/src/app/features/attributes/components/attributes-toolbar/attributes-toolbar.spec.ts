import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesToolbar } from './attributes-toolbar';

describe('AttributesToolbar', () => {
  let component: AttributesToolbar;
  let fixture: ComponentFixture<AttributesToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributesToolbar);
    fixture.componentRef.setInput('totalCount', 0);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
