import { TestBed } from '@angular/core/testing';

import { UploadDdService } from './upload-dd.service';

describe('UploadDdService', () => {
  let service: UploadDdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
