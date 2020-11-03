import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { AppComponent } from 'src/app/app.component';
import { ClientService } from 'src/app/services/client.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  test = new Test();

  questions: any;
  currQuestion: any;
  currIndex: number;
  answers: Array<{ answers: Array<String>, pointsPerQuestion: number }>
  answersHtml: Array<Array<string>>;
  answerCnt = 0;
  minutesLeft: number;
  secondsLeft: number;
  currUserDetails: any;
  timesUp = false;
  end = false;
  happyEnd = false;
  init = false;
  msg = "";

  constructor(private app: AppComponent, private clientService: ClientService, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("client")) {
      //check time
      let time = JSON.parse(sessionStorage.getItem('TimeLeft'));
      if (time) {
        if (time.minutesLeft == 0 && time.secondsLeft == 0) {
          sessionStorage.removeItem('TimeLeft');
          this.happyEnd=true;
          this.app.navigateHome();
          //
        } else {
          this.minutesLeft = time.minutesLeft;
          this.secondsLeft = time.secondsLeft;
          this.initPage(false);
        }
      } else {
        this.initPage(true);
      }
    }
  }

  initPage(setTime) {
    let testName = JSON.parse(sessionStorage.getItem('currTestNameClient'));

    this.currQuestion = { type: "" };
    this.questions = new Array<number>();

    this.clientService.getTest(testName).subscribe((user) => {
      this.test = user[0];
      this.currUserDetails = this.app.currUserDetails; // da li treba provera if(curruserdetails){..}
      //set time
      if (setTime) {
        this.minutesLeft = this.test.duration.minutes;
        this.secondsLeft = this.test.duration.seconds;
        let elem = {
          minutesLeft: this.minutesLeft,
          secondsLeft: this.secondsLeft,
        }
        sessionStorage.setItem('TimeLeft', JSON.stringify(elem));
      }//initialize questions
      this.questions = this.test.questions;
      //random
      let cnt = this.questions.length
      while (cnt > 0) {
        let r1 = Math.floor(Math.random() * this.questions.length);
        let r2 = Math.floor(Math.random() * this.questions.length);
        let p = this.questions[r1];
        this.questions[r1] = this.questions[r2];
        this.questions[r2] = p;
        --cnt;
      }
      for (let i = 0; i < this.questions.length; ++i) {
        if (this.questions[i].answers.length > 1) {
          cnt = this.questions[i].answers.length;
          while (cnt > 0) {
            let r1 = Math.floor(Math.random() * this.questions[i].answers.length);
            let r2 = Math.floor(Math.random() * this.questions[i].answers.length);
            let p = this.questions[i].answers[r1];
            this.questions[i].answers[r1] = this.questions[i].answers[r2];
            this.questions[i].answers[r2] = p;
            --cnt;
          }
        }
      }

      this.currIndex = 0;
      this.currQuestion = this.questions[this.currIndex];

      //initialize answers:
      this.answers = new Array<{ answers: Array<String>, pointsPerQuestion: number }>();       //
      this.answersHtml = new Array<Array<string>>(this.questions.length);
      for (let i = 0; i < this.questions.length; ++i) {
        let elem = {
          answers: new Array<string>(),
          pointsPerQuestion: 0
        }
        this.answers.push(elem);       //
        this.answersHtml[i] = new Array<string>();
        if (this.questions[i].type == "checkbox") {
          for (let j = 0; j < this.questions[i].answers.length; ++j) {
            this.answers[i].answers.push("")      //
            this.answersHtml[i].push("")
          }
        } else {
          this.answers[i].answers.push("")      //
          this.answersHtml[i].push("")
        }
      }
      this.init = true;
    })
  }

  ngAfterViewInit() {
    let x = setInterval(() => {
      if (this.happyEnd) {
        clearInterval(x);
      } else {
        if (this.secondsLeft > 0) {
          --this.secondsLeft;
        } else {
          if (this.minutesLeft > 0) {
            --this.minutesLeft;
            this.secondsLeft = 59;
          } else {
            this.timesUp = true;
            clearInterval(x);
            this.finish();
            this.endTest();
          }
        }
        let elem = {
          minutesLeft: this.minutesLeft,
          secondsLeft: this.secondsLeft,
        }
        sessionStorage.setItem('TimeLeft', JSON.stringify(elem));
        if (this.minutesLeft == 0 && this.secondsLeft == 30) {
          this.msg = "Imate jos " + this.secondsLeft + " sekundi do kraja testa";
          let y = setInterval(() => {
            this.msg = "";
            clearInterval(y);
          }, 5000)
        }
        if (this.minutesLeft == 0 && this.secondsLeft < 30 && this.secondsLeft > 25) {
          this.msg = "Imate jos " + this.secondsLeft + " sekundi do kraja testa";
        }
      }
    }, 1000);

  }

  showQuestion(i) {
    this.currIndex = i;
    this.currQuestion = this.questions[i];
  }

  finish() {
    this.answerCnt = 0;
    for (let i = 0; i < this.answersHtml.length; ++i) {
      if (this.questions[i].type == "checkbox") {
        let inc = false;
        for (let j = 0; j < this.answersHtml[i].length; ++j) {
          if (this.answersHtml[i][j] != "" && this.answersHtml[i][j] != "false") inc = true;
        }
        if (inc)++this.answerCnt;
      } else {
        if (this.answersHtml[i][0] != "")++this.answerCnt;
      }
    }
    this.end = true;
  }

  endTest() {
    //set answers
    for (let i = 0; i < this.answersHtml.length; ++i) {
      this.answers[i].answers = this.answersHtml[i];              ///
    }
    //calculate points
    let usersPoints = 0;
    for (let i = 0; i < this.questions.length; ++i) {
      if (this.questions[i].type == "checkbox") {
        let correctCnt = 0;
        this.questions[i].answers.forEach(element => { if (element.isCorrect)++correctCnt });
        let pointsForCorrect = this.questions[i].points / correctCnt;
        let pointsForFalse = 0;
        if ((this.questions[i].answers.length - correctCnt) != 0)
          pointsForFalse = this.questions[i].points / (this.questions[i].answers.length - correctCnt);
        let myCorrectCnt = 0;
        let myFalseCnt = 0;
        for (let j = 0; j < this.questions[i].answers.length; ++j) {
          if (Boolean(this.answers[i].answers[j]) == true && this.questions[i].answers[j].isCorrect)++myCorrectCnt;
          if (Boolean(this.answers[i].answers[j]) == true && !this.questions[i].answers[j].isCorrect)++myFalseCnt;
        }
        this.answers[i].pointsPerQuestion = myCorrectCnt * pointsForCorrect - myFalseCnt * pointsForFalse;
        if (this.answers[i].pointsPerQuestion < 0) this.answers[i].pointsPerQuestion = 0;
      }
      else {
        if (this.questions[i].type == "radio" || this.questions[i].type == "drop-list") {
          this.answers[i].pointsPerQuestion = 0;
          for (let j = 0; j < this.questions[i].answers.length; ++j) {
            if (this.answers[i].answers[0] == this.questions[i].answers[j].answer && this.questions[i].answers[j].isCorrect) {
              this.answers[i].pointsPerQuestion = this.questions[i].points;
              break;
            }
          }
        } else {
          this.answers[i].pointsPerQuestion = 0;
          for (let j = 0; j < this.questions[i].answers.length; ++j) {
            if (this.answers[i].answers[0] == this.questions[i].answers[j].answer) {
              this.answers[i].pointsPerQuestion = this.questions[i].points;
              break;
            }
          }
        }
      }
      usersPoints += this.answers[i].pointsPerQuestion;
    }
    //if (usersPoints < 0) usersPoints = 0;
    //new elem for test results
    let result = {
      answersPerQuestion: this.answers,
      username: this.app.currUserDetails.username,
      name: this.app.currUserDetails.name,
      surname: this.app.currUserDetails.surname,
      birth_date: this.app.currUserDetails.birth_date,
      pointsSum: usersPoints
    }
    this.test.results.push(result);
    //new elem for user's finished tests
    let finishedTest = {
      name: this.test.name,
      answers: this.answersHtml,
      points: usersPoints
    }
    let user = this.app.currUserDetails;
    user.finishedTests.push(finishedTest);
    //to DB
    this.clientService.endTest(this.test).subscribe(testRes => {
      console.log("testRes");
      console.log(testRes);
      this.clientService.updateUser(user).subscribe(userRes => {
        console.log("userRes");
        console.log(userRes);
        this.happyEnd = true;
        this.minutesLeft = 0;
        this.secondsLeft = 0;
        let elem = {
          minutesLeft: 0,
          secondsLeft: 0,
        }
        sessionStorage.setItem('TimeLeft', JSON.stringify(elem));
        this.app.updateUsersDetails(user);
        this.msg = "Test uspesno predat"
      })
    })
  }

  clearStorage() {
    sessionStorage.removeItem('TimeLeft');
  }
}
