import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeActions } from './attribute-actions';

describe('AttributeActions', () => {
  let component: AttributeActions;
  let fixture: ComponentFixture<AttributeActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeActions],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeActions);
    fixture.componentRef.setInput('options', {});
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
