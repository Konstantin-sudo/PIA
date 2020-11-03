import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Test } from 'src/app/models/test';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests: any;
  sortDesc = {
    order: "Rastuce",// a/descending
    type: "Po nazivu",
  }
  testsToShow: any;
  searchPattern: string;
  empty = false;

  constructor(private clientService: ClientService, private router: Router, private app: AppComponent, private authService: AuthenticationService) { }

  ngOnInit() {
    if (this.authService.check("client")) {
      this.clientService.getTests().subscribe((res) => {
        this.tests = res;
        this.testsToShow = res;
        for (let i = 0; i < this.tests.length; i++) {
          this.tests[i].date_begins = new Date(this.tests[i].date_begins);
          this.tests[i].date_ends = new Date(this.tests[i].date_ends);
          this.testsToShow[i].date_begins = new Date(this.testsToShow[i].date_begins);
          this.testsToShow[i].date_ends = new Date(this.testsToShow[i].date_ends);
        }
        if (this.tests.length == 0) this.empty = true;
      })
    }
  }

  search() {
    this.testsToShow = new Array<Test>();
    for (let i = 0; i < this.tests.length; ++i) {
      if (this.tests[i].name.includes(this.searchPattern)) {
        this.testsToShow.push(this.tests[i]);
      }
    }
    if (this.testsToShow.length == 0) this.empty = true;
    else this.empty = false;
    this.searchPattern = ""
  }

  sort() {
    if (this.sortDesc.order == "Rastuce") {
      if (this.sortDesc.type == "Po nazivu") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (String(this.testsToShow[i].name).toUpperCase() > String(this.testsToShow[j].name).toUpperCase()) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

      if (this.sortDesc.type == "Po datumu pocetka") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (this.testsToShow[i].date_begins > this.testsToShow[j].date_begins) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

      if (this.sortDesc.type == "Po datumu isteka") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (this.testsToShow[i].date_ends > this.testsToShow[j].date_ends) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

    }
    else {
      if (this.sortDesc.type == "Po nazivu") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (String(this.testsToShow[i].name).toUpperCase() < String(this.testsToShow[j].name).toUpperCase()) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

      if (this.sortDesc.type == "Po datumu pocetka") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (this.testsToShow[i].date_begins < this.testsToShow[j].date_begins) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

      if (this.sortDesc.type == "Po datumu isteka") {
        for (let i = 0; i < this.testsToShow.length - 1; i++) {
          for (let j = i + 1; j < this.testsToShow.length; j++) {
            if (this.testsToShow[i].date_ends < this.testsToShow[j].date_ends) {
              let curr = this.testsToShow[i];
              this.testsToShow[i] = this.testsToShow[j];
              this.testsToShow[j] = curr;
            }
          }
        }
      }

    }
  }

  testDetails(test) {
    sessionStorage.setItem('currTestNameClient', JSON.stringify(test.name));
    this.router.navigate(['client/tests/details']);
  }

  goBack() {
    this.router.navigate(['']);
  }

}
