import { TestBed } from '@angular/core/testing';

import { SpecialResolverService } from './special-resolver.service';

describe('SpecialResolverService', () => {
  let service: SpecialResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
