import { Component, OnInit } from '@angular/core';
import { AuthorService } from 'src/app/services/author.service';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Survey } from 'src/app/models/survey';

@Component({
  selector: 'app-my-surveys-author',
  templateUrl: './my-surveys-author.component.html',
  styleUrls: ['./my-surveys-author.component.css']
})
export class MySurveysAuthorComponent implements OnInit {

  mySurveys: any;
  results: any;
  resultsView = false;
  reportView = false;
  currSurvey: any;
  currSurveyReport: Array<{
    questionReport: Array<{
      answer: string,
      appearanceCnt: number,
      appearancePercentage: number
    }>;
  }>;
  surveysToShow: any;
  searchPattern: string;
  empty = false;


  constructor(private authorService: AuthorService, private app: AppComponent, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      this.authorService.getMySurveys(JSON.parse(sessionStorage.getItem('currUser')).username).subscribe(doc => {
        this.mySurveys = doc;
        this.surveysToShow = doc;
        if(this.mySurveys.length==0) this.empty=true;
      })
    }
  }

  search() {
    this.surveysToShow = new Array<Survey>();
    for (let i = 0; i < this.mySurveys.length; ++i) {
      if (this.mySurveys[i].name.includes(this.searchPattern)) {
        this.surveysToShow.push(this.mySurveys[i]);
      }
    }
    if (this.surveysToShow.length == 0) this.empty = true;
    else this.empty = false;
    this.searchPattern = ""
  }

  deleteSurvey(survey) {
    this.authorService.deleteSurvey(survey).subscribe(doc => {
      console.log(doc)
    })
    let i = 0;
    for (i = 0; i < this.mySurveys.length; ++i) {
      if (this.mySurveys[i].name == survey.name) {
        for (let j = i; j < this.mySurveys.length - 1; ++j) {
          this.mySurveys[j] = this.mySurveys[j + 1];
        }
        this.mySurveys.pop();
        break;
      }
    }
    i = 0;
    for (i = 0; i < this.surveysToShow.length; ++i) {
      if (this.surveysToShow[i].name == survey.name) {
        for (let j = i; j < this.surveysToShow.length - 1; ++j) {
          this.surveysToShow[j] = this.surveysToShow[j + 1];
        }
        this.surveysToShow.pop();
        break;
      }
    }
    if(this.surveysToShow.length==0) this.empty=true;

  }

  showResults(survey) {
    this.currSurvey = survey;
    this.results = survey.results;

    this.resultsView = true;
    this.reportView = false;
  }

  showReport(survey) {
    this.currSurvey = survey;
    this.currSurveyReport = new Array<{
      questionReport: Array<{
        answer: string;
        appearanceCnt: number;
        appearancePercentage: number;
      }>;
    }>(this.currSurvey.questions.length);
    for (let i = 0; i < this.currSurveyReport.length; ++i) {
      this.currSurveyReport[i] = {
        questionReport: Array<{
          answer: "";
          appearanceCnt: 0;
          appearancePercentage: 0;
        }>()
      }
    }
    //cnt:
    let results = this.currSurvey.results;
    for (let i = 0; i < results.length; ++i) {
      for (let j = 0; j < results[i].answers.length; ++j) {
        for (let k = 0; k < results[i].answers[j].length; ++k) {
          let m = 0;
          for (m = 0; m < this.currSurveyReport[j].questionReport.length; ++m) {
            if (this.currSurveyReport[j].questionReport[m].answer == results[i].answers[j][k] && results[i].answers[j][k] != "") {
              break;
            }
          }
          if (results[i].answers[j][k] != "") {
            if (m == this.currSurveyReport[j].questionReport.length) {
              let elem: any;
              if (this.currSurvey.questions[j].type.name == "checkbox") {
                elem = {
                  answer: this.currSurvey.questions[j].answers[k],
                  appearanceCnt: 0,
                  appearancePercentage: 0
                }
              } else {
                elem = {
                  answer: results[i].answers[j][k],
                  appearanceCnt: 0,
                  appearancePercentage: 0
                }
              }
              this.currSurveyReport[j].questionReport.push(elem);
            }
            this.currSurveyReport[j].questionReport[m].appearanceCnt++;
          }
        }
      }
    }

    //percentage:
    let answersPerQuestion = Array<number>(this.currSurvey.questions.length);
    for (let i = 0; i < this.currSurveyReport.length; ++i) {
      answersPerQuestion[i] = 0;
      for (let j = 0; j < this.currSurveyReport[i].questionReport.length; ++j) {
        answersPerQuestion[i] += this.currSurveyReport[i].questionReport[j].appearanceCnt;
      }
    }
    for (let i = 0; i < this.currSurveyReport.length; ++i) {
      for (let j = 0; j < this.currSurveyReport[i].questionReport.length; ++j) {
        this.currSurveyReport[i].questionReport[j].appearancePercentage = parseFloat(((this.currSurveyReport[i].questionReport[j].appearanceCnt / answersPerQuestion[i]) * 100).toFixed(2));
      }
    }
    this.resultsView = false;
    this.reportView = true;
  }

  goBack() {
    if (this.resultsView == true || this.reportView == true) {
      this.resultsView = false;
      this.reportView = false;
    }
    else{
      this.app.navigateHome();
    }
  }

}
