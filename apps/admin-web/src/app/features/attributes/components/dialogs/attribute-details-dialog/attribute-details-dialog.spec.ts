import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeDetailsDialog } from './attribute-details-dialog';

describe('AttributeDetailsDialog', () => {
  let component: AttributeDetailsDialog;
  let fixture: ComponentFixture<AttributeDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDetailsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeDetailsDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
