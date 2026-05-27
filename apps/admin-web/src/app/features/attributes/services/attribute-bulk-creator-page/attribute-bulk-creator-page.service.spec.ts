import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AttributeBulkCreatorPageService } from './attribute-bulk-creator-page.service';

describe('AttributeBulkCreatorPageService', () => {
  let service: AttributeBulkCreatorPageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [AttributeBulkCreatorPageService, provideHttpClient()],
    });

    service = TestBed.inject(AttributeBulkCreatorPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
