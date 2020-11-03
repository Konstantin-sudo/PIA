import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTestsAuthorComponent } from './my-tests-author.component';

describe('MyTestsAuthorComponent', () => {
  let component: MyTestsAuthorComponent;
  let fixture: ComponentFixture<MyTestsAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTestsAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTestsAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
