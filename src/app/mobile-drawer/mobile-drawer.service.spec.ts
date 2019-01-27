import { TestBed, inject } from '@angular/core/testing';

import { MobileDrawerService } from './mobile-drawer.service';

describe('MobileDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MobileDrawerService]
    });
  });

  it('should be created', inject([MobileDrawerService], (service: MobileDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
