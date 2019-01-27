import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesInvoicesComponent } from './accessories-invoices.component';

describe('AccessoriesInvoicesComponent', () => {
  let component: AccessoriesInvoicesComponent;
  let fixture: ComponentFixture<AccessoriesInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessoriesInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoriesInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
