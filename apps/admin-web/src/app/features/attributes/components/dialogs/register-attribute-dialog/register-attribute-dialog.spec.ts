import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAttributeDialog } from './register-attribute-dialog';

describe('RegisterAttributeDialog', () => {
  let component: RegisterAttributeDialog;
  let fixture: ComponentFixture<RegisterAttributeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAttributeDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterAttributeDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
