import { TestBed } from '@angular/core/testing';

import { HrreportsService } from './hrreports.service';

describe('HrreportsService', () => {
  let service: HrreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
