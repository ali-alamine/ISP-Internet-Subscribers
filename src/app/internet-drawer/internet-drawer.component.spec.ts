import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetDrawerComponent } from './internet-drawer.component';

describe('InternetDrawerComponent', () => {
  let component: InternetDrawerComponent;
  let fixture: ComponentFixture<InternetDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternetDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


