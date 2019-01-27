import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetInvoicesComponent } from './internet-invoices.component';

describe('InternetInvoicesComponent', () => {
  let component: InternetInvoicesComponent;
  let fixture: ComponentFixture<InternetInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
