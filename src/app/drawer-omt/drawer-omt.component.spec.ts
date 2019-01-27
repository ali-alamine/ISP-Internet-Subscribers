import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerOmtComponent } from './drawer-omt.component';

describe('DrawerOmtComponent', () => {
  let component: DrawerOmtComponent;
  let fixture: ComponentFixture<DrawerOmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerOmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerOmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
