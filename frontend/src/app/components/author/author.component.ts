import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.check("author");
  }

  //Surveys
  showSurveys() {
    this.router.navigate(['author/surveys']);
  }

  createSurvey() {
    this.router.navigate(['author/surveys/create']);
  }
  mySurveys() {
    this.router.navigate(['author/surveys/mysurveys']);
  }

  //Tests
  showTests() {
    this.router.navigate(['author/tests']);
  }
  createTest() {
    this.router.navigate(['author/tests/create']);
  }
  myTests(){
    this.router.navigate(['author/tests/mytests']);
  }
}
