import { TestBed } from '@angular/core/testing';

import { B2bAlertMessageService } from './b2b-alert-message.service';

describe('B2bAlertMessageService', () => {
  let service: B2bAlertMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B2bAlertMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
