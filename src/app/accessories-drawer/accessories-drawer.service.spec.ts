import { TestBed, inject } from '@angular/core/testing';

import { AccessoriesDrawerService } from './accessories-drawer.service';

describe('AccessoriesDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessoriesDrawerService]
    });
  });

  it('should be created', inject([AccessoriesDrawerService], (service: AccessoriesDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
