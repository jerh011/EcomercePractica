import { TestBed } from '@angular/core/testing';

import { AttributeDetailsDialogService } from './attribute-details-dialog.service';

describe('AttributeDetailsDialogService', () => {
  let service: AttributeDetailsDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeDetailsDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
