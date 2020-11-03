import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySurveysAuthorComponent } from './my-surveys-author.component';

describe('MySurveysAuthorComponent', () => {
  let component: MySurveysAuthorComponent;
  let fixture: ComponentFixture<MySurveysAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySurveysAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySurveysAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
