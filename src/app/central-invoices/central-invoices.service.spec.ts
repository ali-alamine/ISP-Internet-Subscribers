import { TestBed, inject } from '@angular/core/testing';

import { CentralInvoicesService } from './central-invoices.service';

describe('CentralInvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentralInvoicesService]
    });
  });

  it('should be created', inject([CentralInvoicesService], (service: CentralInvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
