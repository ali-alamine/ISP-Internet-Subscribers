import { TestBed, inject } from '@angular/core/testing';

import { CreditInvoicesService } from './credit-invoices.service';

describe('CreditInvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditInvoicesService]
    });
  });

  it('should be created', inject([CreditInvoicesService], (service: CreditInvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
