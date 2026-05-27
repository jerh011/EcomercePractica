import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeDetails } from './attribute-details';

describe('AttributeDetails', () => {
  let component: AttributeDetails;
  let fixture: ComponentFixture<AttributeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeDetails);
    fixture.componentRef.setInput('attribute', {
      name: 'Color',
      slug: 'color',
      isActive: true,
      isFilterable: true,
      isRequired: false,
      categories: [],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
