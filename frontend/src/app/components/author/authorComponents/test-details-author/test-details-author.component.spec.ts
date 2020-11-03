import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDetailsAuthorComponent } from './test-details-author.component';

describe('TestDetailsAuthorComponent', () => {
  let component: TestDetailsAuthorComponent;
  let fixture: ComponentFixture<TestDetailsAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDetailsAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDetailsAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
