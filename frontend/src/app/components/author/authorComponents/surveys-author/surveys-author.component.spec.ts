import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveysAuthorComponent } from './surveys-author.component';

describe('SurveysAuthorComponent', () => {
  let component: SurveysAuthorComponent;
  let fixture: ComponentFixture<SurveysAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveysAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveysAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
