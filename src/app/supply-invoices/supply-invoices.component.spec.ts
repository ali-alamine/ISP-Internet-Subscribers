import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyInvoicesComponent } from './supply-invoices.component';

describe('SupplyInvoicesComponent', () => {
  let component: SupplyInvoicesComponent;
  let fixture: ComponentFixture<SupplyInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplyInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
