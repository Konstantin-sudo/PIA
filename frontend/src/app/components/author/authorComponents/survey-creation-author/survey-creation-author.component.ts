import { Component, OnInit } from '@angular/core';
import { Survey } from '../../../../models/survey'
import { AuthorService } from 'src/app/services/author.service';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-survey-creation-author',
  templateUrl: './survey-creation-author.component.html',
  styleUrls: ['./survey-creation-author.component.css']
})
export class SurveyCreationAuthorComponent implements OnInit {

  newSurvey: Survey;
  allQuestions = Array<{ questionText: string }>();
  
  currQuestionIndex = 0;
  currAnswerIndex = 0;

  addQuestionView = false;
  addAnswerView = false;

  msg: string;
  submitted = false;

  constructor(private authorService: AuthorService, private app: AppComponent, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      this.newSurvey = new Survey();
      this.newSurvey.type = "";
	  this.msg = "";
      this.authorService.getQuestions().subscribe(res => {
        let questions: any;
        questions = res
        for (let i = 0; i < questions.length; ++i) {
          this.allQuestions.push(questions[i]);
        }
      })
    }
  }

  showAddQuestion() {
    this.addQuestionView = true;
    this.addAnswerView = false;
    this.currAnswerIndex = 0;
    this.currQuestionIndex = this.newSurvey.questions.length;
    let elem = {
      type: {
        name: "",
        number: 1
      },
      question: "",
      isRequired: false,
      answers: Array<string>()
    }
    this.newSurvey.questions.push(elem);
  }

  showQuestion(i) {
    this.currQuestionIndex = i;
    this.addQuestionView = true;
    this.addAnswerView = false;
    this.currAnswerIndex = 0;
  }

  deleteQuestion() {
    if (this.currQuestionIndex != this.newSurvey.questions.length - 1) {
      for (let i = this.currQuestionIndex; i < this.newSurvey.questions.length - 1; ++i) {
        this.newSurvey.questions[i] = this.newSurvey.questions[i + 1];
      }
    }
    this.newSurvey.questions.pop();
    if (this.newSurvey.questions.length == 0) this.addQuestionView = false;
    this.currQuestionIndex = 0;
  }

  showAddAnswer() {
    this.addAnswerView = true;
    this.currAnswerIndex = this.newSurvey.questions[this.currQuestionIndex].answers.length;
    let elem = "";
    this.newSurvey.questions[this.currQuestionIndex].answers.push(elem);
  }

  showAnswer(i) {
    this.currAnswerIndex = i;
    this.addAnswerView = true;
  }

  deleteAnswer() {
    if (this.currAnswerIndex != this.newSurvey.questions[this.currQuestionIndex].answers.length - 1) {
      for (let i = this.currAnswerIndex; i < this.newSurvey.questions[this.currQuestionIndex].answers.length - 1; ++i) {
        this.newSurvey.questions[this.currQuestionIndex].answers[i] = this.newSurvey.questions[this.currQuestionIndex].answers[i + 1];
      }
    }
    this.newSurvey.questions[this.currQuestionIndex].answers.pop();
    if (this.newSurvey.questions[this.currQuestionIndex].answers.length == 0) this.addAnswerView = false;
    this.currAnswerIndex = 0;
  }


  saveSurvey() {
    this.submitted = true;
    if (this.newSurvey.questions.length == 0) {
      this.msg = "Anketa mora imati bar jedno pitanje."
	  this.showMsg(true);
      return false
    }
    if (this.newSurvey.questions.length < this.newSurvey.pageViewCnt) {
      this.msg = "Broj stranica za prikaz mora biti manji ili jednak broju pitanja";
      this.showMsg(true);
	  return false
    }
    for (let i = 0; i < this.newSurvey.questions.length; ++i) {
      if (this.newSurvey.questions[i].type.name == "radio" || this.newSurvey.questions[i].type.name == "checkbox" || this.newSurvey.questions[i].type.name == "drop-list") {
        if (this.newSurvey.questions[i].answers.length == 0) {
          let n = i + 1;
          this.msg = "Pitanje broj " + n + " mora imati bar jedan ponudjen odgovor";
		  this.showMsg(true);
		  return false;
        }
      }
    }
    //proveri da li je datum pocetka manji od datuma kraja
    if (this.newSurvey.date_begins >= this.newSurvey.date_ends) {
      this.msg = "Datum pocetka ankete mora biti manji od datuma kraja";
      this.showMsg(true);
	  return false;
    }
    //ubaci nova pitanja
    let cnt = 0;
    let newQuestions = Array<{ questionText: string }>()
    for (let i = 0; i < this.newSurvey.questions.length; ++i) {
      let j = 0;
      for (j = 0; j < this.allQuestions.length; ++j) {
        if (this.newSurvey.questions[i].question == this.allQuestions[j].questionText) {
          break;
        }
      }
      if (j == this.allQuestions.length) {
        let elem={
          questionText: this.newSurvey.questions[i].question
        }
        newQuestions.push(elem);
        ++cnt;
      }
    }
    if (cnt > 0) this.authorService.updateQuestions(newQuestions).subscribe(res => { });
    if (this.newSurvey.pageViewCnt <= 0 || this.newSurvey.pageViewCnt == null) this.newSurvey.pageViewCnt = 1;
    this.newSurvey.author = this.app.currUser.username;
    this.authorService.saveNewSurvey(this.newSurvey).subscribe(res => {
      if (res['msg'] == 'ok') this.msg = "Anketa uspesno sacuvana";
      else {
        if (res['msg'] == 'not ok') this.msg = "Anketa nije sacuvana, postoji anketa sa sitim imenom";
      }
	  this.showMsg(true);
    })
  }


  showMsg(valid: boolean) {
	if(!this.submitted && !valid)
		this.msg = " Sva polja osim 'Osnovne informacije' i 'Broj stranica za prikaz' su obavezna!";
    setTimeout(() => {
		this.msg = "";
		this.submitted = false;
    }, 5000)
  }


}
