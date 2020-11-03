import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';
import { AuthorService } from 'src/app/services/author.service';
import { Survey } from 'src/app/models/survey';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-survey-details-author',
  templateUrl: './survey-details-author.component.html',
  styleUrls: ['./survey-details-author.component.css']
})
export class SurveyDetailsAuthorComponent implements OnInit {

  currSurvey = new Survey();
  currDate = new Date();
  results = false;
  answers: any;
  saved: boolean;
  finished: boolean;

  constructor(private app: AppComponent, private router: Router, private authorService: AuthorService,private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      let currSurveyName = JSON.parse(sessionStorage.getItem('currSurveyNameAuthor'));

      this.authorService.getSurvey(currSurveyName).subscribe(survey => {
        this.currSurvey = survey[0];
        let currUser = this.app.currUserDetails;
        if (!currUser) {
          this.app.getUserService().getUser(JSON.parse(sessionStorage.getItem('currUser')).username).subscribe(user => {
            currUser = user[0];
            this.currSurvey.date_begins = new Date(this.currSurvey.date_begins)
            this.currSurvey.date_ends = new Date(this.currSurvey.date_ends)
            this.finished = false;
            for (let j = 0; j < currUser.finishedSurveys.length; j++) {
              if (currUser.finishedSurveys[j].name == this.currSurvey.name) {
                this.finished = true;
                break;
              }
            }
            if (this.finished == false) {
              this.saved = false;
              for (let j = 0; j < currUser.savedSurveys.length; j++) {
                if (currUser.savedSurveys[j].name == this.currSurvey.name) {
                  this.saved = true;
                  break;
                }
              }
            } else {
              this.saved = false;
            }
          })
        } else {
          this.currSurvey.date_begins = new Date(this.currSurvey.date_begins)
          this.currSurvey.date_ends = new Date(this.currSurvey.date_ends)
          this.finished = false;
          for (let j = 0; j < currUser.finishedSurveys.length; j++) {
            if (currUser.finishedSurveys[j].name == this.currSurvey.name) {
              this.finished = true;
              break;
            }
          }
          if (this.finished == false) {
            this.saved = false;
            for (let j = 0; j < currUser.savedSurveys.length; j++) {
              if (currUser.savedSurveys[j].name == this.currSurvey.name) {
                this.saved = true;
                break;
              }
            }
          } else {
            this.saved = false;
          }
        }

      })
    }


  }

  showResults() {
    let currUser = this.app.currUserDetails;
    for (let i = 0; i < currUser.finishedSurveys.length; i++) {
      if (this.currSurvey.name == currUser.finishedSurveys[i].name) {
        this.answers = currUser.finishedSurveys[i].answers;
        break;
      }
    }
    this.results = true;
  }

  fill() {
    this.router.navigate(['author/surveys/survey']);
  }

  continue() {
    this.router.navigate(['author/surveys/survey']);
  }
  goBack() {
    if (this.results == true) this.results = false;
    else
      this.router.navigate(['author/surveys']);
  }
}
