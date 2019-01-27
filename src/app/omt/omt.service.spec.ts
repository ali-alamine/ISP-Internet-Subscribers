import { TestBed, inject } from '@angular/core/testing';

import { OmtService } from './omt.service';

describe('OmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OmtService]
    });
  });

  it('should be created', inject([OmtService], (service: OmtService) => {
    expect(service).toBeTruthy();
  }));
});
