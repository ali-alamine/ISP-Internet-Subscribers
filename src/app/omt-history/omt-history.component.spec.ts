import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmtHistoryComponent } from './omt-history.component';

describe('OmtHistoryComponent', () => {
  let component: OmtHistoryComponent;
  let fixture: ComponentFixture<OmtHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmtHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmtHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
