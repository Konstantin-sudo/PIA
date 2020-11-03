import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { AppComponent } from 'src/app/app.component';
import { AuthorService } from 'src/app/services/author.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-test-creation-author',
  templateUrl: './test-creation-author.component.html',
  styleUrls: ['./test-creation-author.component.css']
})
export class TestCreationAuthorComponent implements OnInit {

  newTest: Test;
  allQuestions = Array<{ questionText: String }>();

  addQuestionView = false;
  addAnswerView = false;

  currQuestionIndex = 0;
  currAnswerIndex = 0;

  msg: string;
  submitted = false;

  constructor(private app: AppComponent, private authorService: AuthorService, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      this.newTest = new Test();
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


  //questions
  showAddQuestion() {
    this.addQuestionView = true;
    this.addAnswerView = false;
    this.currAnswerIndex = 0;
    this.currQuestionIndex = this.newTest.questions.length;
    let elem = {
      type: "",
      question: "",
      points: 0,
      answers: Array<{ answer: string, isCorrect: boolean }>()
    }
    this.newTest.questions.push(elem);
  }

  showQuestion(i) {
    this.currQuestionIndex = i;
    this.addQuestionView = true;
    this.addAnswerView = false;
    this.currAnswerIndex = 0;
  }

  deleteQuestion() {
    if (this.currQuestionIndex != this.newTest.questions.length - 1) {
      for (let i = this.currQuestionIndex; i < this.newTest.questions.length - 1; ++i) {
        this.newTest.questions[i] = this.newTest.questions[i + 1];
      }
    }
    this.newTest.questions.pop();
    if (this.newTest.questions.length == 0) this.addQuestionView = false;
    this.currQuestionIndex = 0;
  }


  //answers
  showAddAnswer() {
    this.addAnswerView = true;
    this.currAnswerIndex = this.newTest.questions[this.currQuestionIndex].answers.length;
    let elem = {
      answer: "",
      isCorrect: false
    };
    this.newTest.questions[this.currQuestionIndex].answers.push(elem);
  }

  showAnswer(i) {
    this.currAnswerIndex = i;
    this.addAnswerView = true;
  }

  deleteAnswer() {
    if (this.currAnswerIndex != this.newTest.questions[this.currQuestionIndex].answers.length - 1) {
      for (let i = this.currAnswerIndex; i < this.newTest.questions[this.currQuestionIndex].answers.length - 1; ++i) {
        this.newTest.questions[this.currQuestionIndex].answers[i] = this.newTest.questions[this.currQuestionIndex].answers[i + 1];
      }
    }
    this.newTest.questions[this.currQuestionIndex].answers.pop();
    if (this.newTest.questions[this.currQuestionIndex].answers.length == 0) this.addAnswerView = false;
    this.currAnswerIndex = 0;
  }

  saveTest() {
    this.submitted = true;
    let error = false;
    //da li anketa ima bar 1 pitanje
    if (this.newTest.questions.length == 0) {
      this.msg = "Test mora imati najmanje jedno pitanje."
      error = true;
    }
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //da li postoji pitanje bez odgovora ?
    for (let i = 0; i < this.newTest.questions.length; ++i) {
      if (this.newTest.questions[i].answers.length == 0) {
        let n = i + 1;
        this.msg = "Pitanje broj " + n + " mora imati bar jedan ponudjen/tacan odgovor";
        error = true;
      }
    }
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //da li je trajanje <= 3 min. ?
    if (this.newTest.duration.minutes > 3 || this.newTest.duration.minutes < 0 ||
      this.newTest.duration.seconds > 59 || this.newTest.duration.seconds < 0) {
      this.msg = "Test mora trajati 3 ili manje minuta";
      error = true;;
    } else {
      if (this.newTest.duration.minutes == 3) {
        if (this.newTest.duration.seconds > 0) {
          this.msg = "Test mora trajati 3 ili manje minuta";
          error = true;;
        }
      } else {
        if (this.newTest.duration.minutes == 0 && this.newTest.duration.seconds == 0) {
          this.msg = "Test mora trajati 3 ili manje minuta";
          error = true;;
        }
      }
    }
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //proveri da li je datum pocetka manji od datuma kraja
    if (this.newTest.date_begins >= this.newTest.date_ends) {
      this.msg = "Datum pocetka testa mora biti manji od datuma kraja";
      error = true;;
    }
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //broj poena mora biti veci od nule i u isto vreme postavi svim pitanjima ukupan broj poena(readio,checkbox,drop-list) 
    let sum = 0
    this.newTest.questions.forEach(q => sum += q.points);
    if (sum <= 0) {
      this.msg = "Maksimalan broj poena mora biti veci od nule"
      error = true;;
    } else {
      this.newTest.maxPoints = sum;
    }
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //da li ima vise tacnih odgovora u pitanju radio/drop-list ili makar 1 u checkboxu?
    this.newTest.questions.forEach((q, i) => {
      if (q.type == "radio" || q.type == "drop-list") {
        let cnt = 0;
        q.answers.forEach(qa => {
          if (qa.isCorrect == true)++cnt;
        })
        if (cnt == 0 || cnt > 1) {
          let n = i + 1;
          this.msg = "Pitanje " + n + ", tipa " + q.type + " mora da ima tacno jedan tacan odgovor";
          error = true;
        }
      } else {
        if (q.type == "checkbox") {
          let cnt = 0;
          q.answers.forEach(qa => {
            if (qa.isCorrect)++cnt;
          })
          if (cnt == 0) {
            let n = i + 1;
            this.msg = "Pitanje " + n + ", tipa " + q.type + " mora imati najmanje jedan tacan odgovor"
            error = true;;
          }
        }
      }
    })
    if (error)
	{
		this.showMsg(true)
		return;
	}
    //sacuvaj nova pitanja
    let cnt = 0;
    let newQuestions = Array<{ questionText: String }>()
    for (let i = 0; i < this.newTest.questions.length; ++i) {
      let j = 0;
      for (j = 0; j < this.allQuestions.length; ++j) {
        if (this.newTest.questions[i].question == this.allQuestions[j].questionText) {
          break;
        }
      }
      if (j == this.allQuestions.length) {
        let elem={
          questionText: this.newTest.questions[i].question
        }
        newQuestions.push(elem);
        ++cnt;
      }
    }
    if (cnt > 0) this.authorService.updateQuestions(newQuestions).subscribe(res => { });
    //
    this.newTest.author = this.app.currUser.username;
    let t: any;
    t = this.newTest;
    this.authorService.saveNewTest(t).subscribe(res => {
      if (res['msg'] == 'ok') this.msg = "Test uspesno sacuvan";
      else {
        if (res['msg'] == 'not ok') this.msg = "Test nije sacuvan";
      }
	  this.showMsg(true);
    })
  }

  showMsg(valid:boolean) {
    if(!this.submitted && !valid)
		this.msg = " Sva polja osim 'Osnovne informacije' su obavezna!";
    setTimeout(() => {
		this.msg = "";
		this.submitted = false;
    }, 5000)
  }
  
}
