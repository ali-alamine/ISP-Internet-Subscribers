import { TestBed, inject } from '@angular/core/testing';

import { InternetDrawerService } from './internet-drawer.service';

describe('InternetDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternetDrawerService]
    });
  });

  it('should be created', inject([InternetDrawerService], (service: InternetDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
