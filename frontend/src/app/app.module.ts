import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './services/users.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientComponent } from './components/client/client.component';
import { AuthorComponent } from './components/author/author.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasschangeComponent } from './components/passchange/passchange.component';
import { SurveyDetailsComponent } from './components/client/clientComponents/survey-details/survey-details.component';
import { TestsComponent } from './components/client/clientComponents/tests/tests.component';
import { SurveysComponent } from './components/client/clientComponents/surveys/surveys.component';
import { SurveyComponent } from './components/client/clientComponents/survey/survey.component';
import { SurveyDetailsAuthorComponent } from './components/author/authorComponents/survey-details-author/survey-details-author.component';
import { SurveysAuthorComponent } from './components/author/authorComponents/surveys-author/surveys-author.component';
import { TestsAuthorComponent } from './components/author/authorComponents/tests-author/tests-author.component';
import { MyTestsAuthorComponent } from './components/author/authorComponents/my-tests-author/my-tests-author.component';
import { MySurveysAuthorComponent } from './components/author/authorComponents/my-surveys-author/my-surveys-author.component';
import { SurveyAuthorComponent } from './components/author/authorComponents/survey-author/survey-author.component';
import { SurveyCreationAuthorComponent } from './components/author/authorComponents/survey-creation-author/survey-creation-author.component';
import { TestCreationAuthorComponent } from './components/author/authorComponents/test-creation-author/test-creation-author.component';
import { TestDetailsAuthorComponent } from './components/author/authorComponents/test-details-author/test-details-author.component';
import { TestAuthorComponent } from './components/author/authorComponents/test-author/test-author.component';
import { TestDetailsComponent } from './components/client/clientComponents/test-details/test-details.component';
import { TestComponent } from './components/client/clientComponents/test/test.component';
import { RecaptchaModule } from 'ng-recaptcha'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ClientComponent,
    AuthorComponent,
    AdminComponent,
    PasschangeComponent,
    SurveyDetailsComponent,
    TestsComponent,
    SurveysComponent,
    SurveyComponent,
    SurveyDetailsAuthorComponent,
    SurveysAuthorComponent,
    TestsAuthorComponent,
    MyTestsAuthorComponent,
    MySurveysAuthorComponent,
    SurveyAuthorComponent,
    SurveyCreationAuthorComponent,
    TestCreationAuthorComponent,
    TestDetailsAuthorComponent,
    TestAuthorComponent,
    TestDetailsComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
