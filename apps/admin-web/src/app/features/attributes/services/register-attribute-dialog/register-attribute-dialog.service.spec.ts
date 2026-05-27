import { TestBed } from '@angular/core/testing';

import { RegisterAttributeDialogService } from './register-attribute-dialog.service';

describe('RegisterAttributeDialogService', () => {
  let service: RegisterAttributeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterAttributeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
