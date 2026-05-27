import { TestBed } from '@angular/core/testing';
import { AttributeCategoriesService } from './attribute-categories.service';

describe('AttributeCategoriesService', () => {
  let service: AttributeCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
