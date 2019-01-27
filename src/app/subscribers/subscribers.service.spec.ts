import { TestBed, inject } from '@angular/core/testing';

import { SubscribersService } from './subscribers.service';

describe('SubscribersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscribersService]
    });
  });

  it('should be created', inject([SubscribersService], (service: SubscribersService) => {
    expect(service).toBeTruthy();
  }));
});
