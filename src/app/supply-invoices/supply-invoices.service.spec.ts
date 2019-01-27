import { TestBed, inject } from '@angular/core/testing';

import { SupplyInvoicesService } from './supply-invoices.service';

describe('SupplyInvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplyInvoicesService]
    });
  });

  it('should be created', inject([SupplyInvoicesService], (service: SupplyInvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
