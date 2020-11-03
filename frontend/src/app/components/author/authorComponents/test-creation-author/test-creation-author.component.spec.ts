import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreationAuthorComponent } from './test-creation-author.component';

describe('TestCreationAuthorComponent', () => {
  let component: TestCreationAuthorComponent;
  let fixture: ComponentFixture<TestCreationAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCreationAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCreationAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
