import { TestBed, inject } from '@angular/core/testing';

import { AccessoriesInvoicesService } from './accessories-invoices.service';

describe('AccessoriesInvoicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessoriesInvoicesService]
    });
  });

  it('should be created', inject([AccessoriesInvoicesService], (service: AccessoriesInvoicesService) => {
    expect(service).toBeTruthy();
  }));
});
