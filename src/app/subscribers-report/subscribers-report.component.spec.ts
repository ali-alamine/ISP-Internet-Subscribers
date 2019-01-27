import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersReportComponent } from './subscribers-report.component';

describe('SubscribersReportComponent', () => {
  let component: SubscribersReportComponent;
  let fixture: ComponentFixture<SubscribersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
