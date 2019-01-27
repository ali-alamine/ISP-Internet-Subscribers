import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralInvoicesComponent } from './central-invoices.component';

describe('CentralInvoicesComponent', () => {
  let component: CentralInvoicesComponent;
  let fixture: ComponentFixture<CentralInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
