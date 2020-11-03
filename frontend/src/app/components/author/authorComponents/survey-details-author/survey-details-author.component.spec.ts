import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDetailsAuthorComponent } from './survey-details-author.component';

describe('SurveyDetailsAuthorComponent', () => {
  let component: SurveyDetailsAuthorComponent;
  let fixture: ComponentFixture<SurveyDetailsAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyDetailsAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDetailsAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
