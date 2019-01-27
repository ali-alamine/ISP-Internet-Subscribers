import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesDrawerComponent } from './accessories-drawer.component';

describe('AccessoriesDrawerComponent', () => {
  let component: AccessoriesDrawerComponent;
  let fixture: ComponentFixture<AccessoriesDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessoriesDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoriesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
