import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthorService } from 'src/app/services/author.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Test } from 'src/app/models/test';

@Component({
  selector: 'app-test-details-author',
  templateUrl: './test-details-author.component.html',
  styleUrls: ['./test-details-author.component.css']
})
export class TestDetailsAuthorComponent implements OnInit {

  currTest = new Test();
  currDate = new Date();
  answers: any;
  myPoints: Array<number>;
  myPointsSum = 0;
  maxPoints = 0;
  results = false;
  finished: boolean;

  constructor(private router: Router, private app: AppComponent, private authService: AuthenticationService, private authorService: AuthorService) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      let currTestName = JSON.parse(sessionStorage.getItem('currTestNameAuthor'));
      this.authorService.getTest(currTestName).subscribe((test) => {
        this.currTest = test[0];
        this.currTest.date_begins = new Date(this.currTest.date_begins)
        this.currTest.date_ends = new Date(this.currTest.date_ends)
        let currUser = this.app.currUserDetails; //mora da se azurira svaki put pri zavrsenom testu ili anketi
        if (currUser == null) {
          this.app.getUserService().getUser(JSON.parse(sessionStorage.getItem('currUser')).username).subscribe((user) => {
            currUser = user[0];
            this.finished = false;
            for (let i = 0; i < currUser.finishedTests.length; i++) {
              if (currUser.finishedTests[i].name == this.currTest.name) {
                this.finished = true;
                return;
              }
            }
          })
        } else {
          this.finished = false;
          for (let i = 0; i < currUser.finishedTests.length; i++) {
            if (currUser.finishedTests[i].name == this.currTest.name) {
              this.finished = true;
              return;
            }
          }
        }
      })
    }
  }

  showResults() {
    let currUser = this.app.currUserDetails;
    for (let i = 0; i < currUser.finishedTests.length; i++) {
      if (this.currTest.name == currUser.finishedTests[i].name) {
        this.answers = currUser.finishedTests[i].answers;
        break;
      }
    }
    this.myPoints = new Array<number>(this.currTest.questions.length);
    let myResult: any;
    for (let i = 0; i < this.currTest.results.length; ++i) {
      if (currUser.username == this.currTest.results[i].username && currUser.name == this.currTest.results[i].name
        && currUser.surname == this.currTest.results[i].surname && currUser.birth_date == this.currTest.results[i].birth_date) { // ovo je lose
        myResult = this.currTest.results[i];
        break;
      }
    }
    for (let i = 0; i < myResult.answersPerQuestion.length; ++i) {
      this.myPoints[i] = myResult.answersPerQuestion[i].pointsPerQuestion;
    }
    this.myPointsSum = myResult.pointsSum;
    this.maxPoints = this.currTest.maxPoints;

    this.results = true;
  }

  fill() {
    this.router.navigate(['author/tests/test']);
  }

  goBack() {
    if (this.results == true) this.results = false;
    else
      this.router.navigate(['author/tests']);
  }
}
