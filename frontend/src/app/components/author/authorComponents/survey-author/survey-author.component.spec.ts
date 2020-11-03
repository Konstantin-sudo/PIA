import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAuthorComponent } from './survey-author.component';

describe('SurveyAuthorComponent', () => {
  let component: SurveyAuthorComponent;
  let fixture: ComponentFixture<SurveyAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
