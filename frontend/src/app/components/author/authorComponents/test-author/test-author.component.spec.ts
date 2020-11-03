import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAuthorComponent } from './test-author.component';

describe('TestAuthorComponent', () => {
  let component: TestAuthorComponent;
  let fixture: ComponentFixture<TestAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
