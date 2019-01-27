import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmtComponent } from './omt.component';

describe('OmtComponent', () => {
  let component: OmtComponent;
  let fixture: ComponentFixture<OmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
