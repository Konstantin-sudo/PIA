import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientComponent } from './components/client/client.component';
import { AuthorComponent } from './components/author/author.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasschangeComponent } from './components/passchange/passchange.component';
import { SurveysComponent } from './components/client/clientComponents/surveys/surveys.component';
import { SurveyDetailsComponent } from './components/client/clientComponents/survey-details/survey-details.component';
import { TestsComponent } from './components/client/clientComponents/tests/tests.component';
import { SurveyComponent } from './components/client/clientComponents/survey/survey.component';
import { SurveysAuthorComponent } from './components/author/authorComponents/surveys-author/surveys-author.component';
import { TestsAuthorComponent } from './components/author/authorComponents/tests-author/tests-author.component';
import { SurveyDetailsAuthorComponent } from './components/author/authorComponents/survey-details-author/survey-details-author.component';
import { SurveyAuthorComponent } from './components/author/authorComponents/survey-author/survey-author.component';
import { SurveyCreationAuthorComponent } from './components/author/authorComponents/survey-creation-author/survey-creation-author.component';
import { MySurveysAuthorComponent } from './components/author/authorComponents/my-surveys-author/my-surveys-author.component';
import { TestCreationAuthorComponent } from './components/author/authorComponents/test-creation-author/test-creation-author.component';
import { TestDetailsAuthorComponent } from './components/author/authorComponents/test-details-author/test-details-author.component';
import { TestAuthorComponent } from './components/author/authorComponents/test-author/test-author.component';
import { MyTestsAuthorComponent } from './components/author/authorComponents/my-tests-author/my-tests-author.component';
import { TestDetailsComponent } from './components/client/clientComponents/test-details/test-details.component';
import { TestComponent } from './components/client/clientComponents/test/test.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path:'client', component: ClientComponent },
  { path:'author', component: AuthorComponent },
  { path:'admin', component: AdminComponent },
  { path:'passchange', component: PasschangeComponent },
  
  { path:'client/surveys', component: SurveysComponent },
  { path:'client/surveys/details', component: SurveyDetailsComponent },
  { path:'client/surveys/survey', component: SurveyComponent },
  { path:'client/tests', component: TestsComponent },
  { path:'client/tests/details', component: TestDetailsComponent },
  { path:'client/tests/test', component: TestComponent },

  { path:'author/surveys', component: SurveysAuthorComponent },
  { path:'author/surveys/details', component: SurveyDetailsAuthorComponent },
  { path:'author/surveys/survey', component: SurveyAuthorComponent },
  { path:'author/surveys/create', component: SurveyCreationAuthorComponent },
  { path:'author/surveys/mysurveys', component: MySurveysAuthorComponent },
  { path:'author/tests', component: TestsAuthorComponent },
  { path:'author/tests/create', component: TestCreationAuthorComponent },
  { path:'author/tests/details', component:  TestDetailsAuthorComponent},
  { path:'author/tests/test', component:  TestAuthorComponent},
  { path:'author/tests/mytests', component:  MyTestsAuthorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
