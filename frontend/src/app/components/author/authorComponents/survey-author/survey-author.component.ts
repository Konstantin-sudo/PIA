import { Component, OnInit } from '@angular/core';
import { AuthorService } from 'src/app/services/author.service';
import { AppComponent } from 'src/app/app.component';
import { Survey } from 'src/app/models/survey';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-survey-author',
  templateUrl: './survey-author.component.html',
  styleUrls: ['./survey-author.component.css']
})
export class SurveyAuthorComponent implements OnInit {

  survey = new Survey();

  questionsToShow: any;
  answers: Array<Array<string>>;
  answersIteration: Array<Array<string>>;
  answerCnt = 0;

  lowIndex: number;
  highIndex: number;
  questionPerPageCnt: number;
  currPage: number;
  maxPageNumber: number;
  remainder: number;

  currUserDetails: any;

  end: boolean;
  happyEnd = false;
  msg = "";

  constructor(private authorService: AuthorService, private app: AppComponent, private authService: AuthenticationService) {
  }

  ngOnInit() {
    if (this.authService.check("author")) {
      let finishedSurvey = JSON.parse(sessionStorage.getItem('finishedSurvey'));
      if (finishedSurvey) {
        sessionStorage.removeItem('finishedSurvey');
        this.app.navigateHome();
      }
      else {
        let surveyName = JSON.parse(sessionStorage.getItem('currSurveyNameAuthor'));

        this.authorService.getSurvey(surveyName).subscribe(survey => {
          this.survey = survey[0];
          this.currUserDetails = this.app.currUserDetails; //provera if(currUserDetails) ??
          //questionsToShow:
          let pageCnt = this.survey.pageViewCnt;
          let questionCnt = this.survey.questions.length;
          this.questionPerPageCnt = Math.round(questionCnt / pageCnt);
          this.remainder = questionCnt % pageCnt;
          this.currPage = 1;
          this.maxPageNumber = pageCnt;
          this.lowIndex = 0;
          this.highIndex = this.lowIndex + this.questionPerPageCnt;
          if (pageCnt == 1) {
            this.questionsToShow = this.survey.questions;
          } else {
            this.questionsToShow = this.survey.questions.slice(this.lowIndex, this.highIndex);
          }
          this.end = false;
  
          //answers:
          let saved = false;
          for (let j = 0; j < this.currUserDetails.savedSurveys.length; j++) {
            if (this.currUserDetails.savedSurveys[j].name == this.survey.name) {
              saved = true;
              break;
            }
          }
          if (saved) {
            for (let i = 0; i < this.currUserDetails.savedSurveys.length; ++i) {
              if (this.survey.name == this.currUserDetails.savedSurveys[i].name) {
                this.answers = this.currUserDetails.savedSurveys[i].answers;
  
                this.answersIteration = new Array<Array<string>>(questionCnt);
                for (let i = 0; i < questionCnt; ++i) {
                  this.answersIteration[i] = new Array<string>();
                  if (this.survey.questions[i].type.name == "radio" || this.survey.questions[i].type.name == "text-area" || this.survey.questions[i].type.name == "drop-list") {
                    this.answersIteration[i].push("");
                  } else {
                    if (this.survey.questions[i].type.name == "number" || this.survey.questions[i].type.name == "text") {
                      for (let k = 0; k < this.survey.questions[i].type.number; k++) {
                        this.answersIteration[i].push("");
                      }
                    } else {
                      for (let j = 0; j < this.survey.questions[i].answers.length; j++) {
                        this.answersIteration[i].push("");
                      }
                    }
                  }
                }
                break;
              }
            }
          } else {
            this.answers = new Array<Array<string>>(questionCnt);
            this.answersIteration = new Array<Array<string>>(questionCnt);
            for (let i = 0; i < questionCnt; ++i) {
              this.answers[i] = new Array<string>();
              this.answersIteration[i] = new Array<string>();
              if (this.survey.questions[i].type.name == "radio" || this.survey.questions[i].type.name == "text-area" || this.survey.questions[i].type.name == "drop-list") {
                this.answers[i].push("");
                this.answersIteration[i].push("");
              } else {
                if (this.survey.questions[i].type.name == "number" || this.survey.questions[i].type.name == "text") {
                  for (let k = 0; k < this.survey.questions[i].type.number; k++) {
                    this.answers[i].push("");
                    this.answersIteration[i].push("");
                  }
                } else {
                  for (let j = 0; j < this.survey.questions[i].answers.length; j++) {
                    this.answers[i].push("");
                    this.answersIteration[i].push("");
                  }
                }
              }
            }
          }
        })
      }
    }
  }

  prevPage() {
    --this.currPage;
    this.highIndex = this.lowIndex;
    this.lowIndex = this.highIndex - this.questionPerPageCnt;
    this.questionsToShow = this.survey.questions.slice(this.lowIndex, this.highIndex);
  }

  nextPage() {
    ++this.currPage;
    this.lowIndex = this.highIndex;
    this.highIndex = this.highIndex + this.questionPerPageCnt;
    if (this.survey.questions.length - this.highIndex <= this.remainder) this.highIndex += this.remainder;
    this.questionsToShow = this.survey.questions.slice(this.lowIndex, this.highIndex);
  }

  finish() {
    //calculate answer cnt
    this.answerCnt = 0;
    for (let i = 0; i < this.answers.length; ++i) {
      if (this.survey.questions[i].type.name == "checkbox") {
        let inc = false;
        for (let j = 0; j < this.answers[i].length; ++j) {
          if (this.answers[i][j] != "" && this.answers[i][j] != "false") inc = true;
        }
        if (inc)++this.answerCnt;
      } else {
        if (this.answers[i][0] != "")++this.answerCnt;
      }
    }
    //check required
    let correct = true;
    for (let i = 0; i < this.survey.questions.length; ++i) {
      if (this.survey.questions[i].isRequired) {
        let j = 0;
        for (j = 0; j < this.answers[i].length; ++j) {
          if (this.answers[i][j] != "") break;
        }
        if (j == this.answers[i].length) {
          correct = false;
          break;
        }
      }
    }
    if (correct) this.end = true;
    else this.msg = "Niste popunili sva obavezna polja"
  }

  endSurvey() {
    let elem: any;
    let user: any;
    user = this.currUserDetails;
    if (this.survey.type == "Personalizovana") {
      elem = {
        answers: this.answers,
        name: user.name,
        surname: user.surname,
        birth_date: user.birth_date
      }
    }
    else {
      elem = {
        answers: this.answers,
        name: "",
        surname: "",
        birth_date: "",
      }
    }
    this.survey.results.push(elem);
    let elemUser = {
      name: this.survey.name,
      answers: this.answers
    }
    user.finishedSurveys.push(elemUser)
    let i = 0;
    for (i = 0; i < user.savedSurveys.length; i++) {
      if (user.savedSurveys[i].name == this.survey.name) break;
    }
    if (i != user.savedSurveys.length) {
      for (let j = i; j < user.savedSurveys.length; ++j) {
        user.savedSurveys[i] = user.savedSurveys[i + 1];
      }
      user.savedSurveys.pop();
    }
    this.authorService.endSurvey(this.survey).subscribe((resSurvey) => {
      console.log(resSurvey);
      this.authorService.updateUser(user).subscribe(resUpdate => {
        console.log(resUpdate);
        this.app.updateUsersDetails(user);
        this.msg = "Anketa uspesno poslata"
        this.happyEnd = true;
        sessionStorage.setItem('finishedSurvey', JSON.stringify(true));
      })
    })
  }

  save() {
    let user: any;
    user = this.currUserDetails;
    let elem = {
      name: this.survey.name,
      answers: this.answers
    }
    let i = 0;
    for (i = 0; i < user.savedSurveys.length; i++) {
      if (user.savedSurveys[i].name == this.survey.name) break;
    }
    if (i == user.savedSurveys.length) {
      user.savedSurveys.push(elem);
    } else {
      user.savedSurveys[i] = elem;
    }
    this.authorService.updateUser(user).subscribe((resUpdate) => {
      console.log(resUpdate);
      this.app.updateUsersDetails(user);
      this.msg = "Anketa uspesno sacuvana"
      this.happyEnd = true;
      sessionStorage.setItem('finishedSurvey', JSON.stringify(true));
    })
  }

  ngOnDestroy() {
    sessionStorage.removeItem('finishedSurvey');
  }




}
