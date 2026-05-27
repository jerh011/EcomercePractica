import { TestBed } from '@angular/core/testing';

import { AttributesPageService } from './attributes-page.service';

describe('AttributesPageService', () => {
  let service: AttributesPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributesPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
