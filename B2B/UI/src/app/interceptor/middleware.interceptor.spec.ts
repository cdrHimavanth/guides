import { TestBed } from '@angular/core/testing';

import { MiddlewareInterceptor } from './middleware.interceptor';

describe('MiddlewareInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MiddlewareInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MiddlewareInterceptor = TestBed.inject(MiddlewareInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
