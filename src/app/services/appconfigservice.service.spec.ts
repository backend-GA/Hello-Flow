import { TestBed } from '@angular/core/testing';

import { AppconfigserviceService } from './appconfigservice.service';

describe('AppconfigserviceService', () => {
  let service: AppconfigserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppconfigserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
