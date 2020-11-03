import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCreationAuthorComponent } from './survey-creation-author.component';

describe('SurveyCreationAuthorComponent', () => {
  let component: SurveyCreationAuthorComponent;
  let fixture: ComponentFixture<SurveyCreationAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCreationAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCreationAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
