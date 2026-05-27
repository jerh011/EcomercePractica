import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAttributePage } from './edit-attribute-page';

describe('EditAttributePage', () => {
  let component: EditAttributePage;
  let fixture: ComponentFixture<EditAttributePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttributePage],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttributePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
