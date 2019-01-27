import { TestBed, inject } from '@angular/core/testing';

import { SubscriptionService } from './subscription.service';

describe('SubscribersReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionService]
    });
  });

  it('should be created', inject([SubscriptionService], (service: SubscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
