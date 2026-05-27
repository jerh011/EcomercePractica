import { TestBed } from '@angular/core/testing';
import { EditAttributePageService } from './edit-attribute-page.service';

describe('EditAttributePageService', () => {
  let service: EditAttributePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAttributePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
