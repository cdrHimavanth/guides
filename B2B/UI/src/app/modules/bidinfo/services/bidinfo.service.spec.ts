import { TestBed } from '@angular/core/testing';

import { BidinfoService } from './bidinfo.service';

describe('BidinfoService', () => {
  let service: BidinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
