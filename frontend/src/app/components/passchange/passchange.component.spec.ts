import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasschangeComponent } from './passchange.component';

describe('PasschangeComponent', () => {
  let component: PasschangeComponent;
  let fixture: ComponentFixture<PasschangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasschangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasschangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
