import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthorService } from 'src/app/services/author.service';
import * as d3 from "d3"
import { Test } from 'src/app/models/test';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-my-tests-author',
  templateUrl: './my-tests-author.component.html',
  styleUrls: ['./my-tests-author.component.css']
})
export class MyTestsAuthorComponent implements OnInit {

  myTests: any;

  currTest: any;
  stat = Array<number>(10)
  resultsView = false;
  resultsEmpty = false;

  testsToShow: any;
  searchPattern: string;
  empty = false;

  constructor(private authService: AuthenticationService, private authorService: AuthorService, private app: AppComponent) { }

  ngOnInit() {
    if (this.authService.check("author")) {
      this.authorService.getMyTests(JSON.parse(sessionStorage.getItem('currUser')).username).subscribe(tests => {
        this.myTests = tests;
        this.testsToShow = tests;
        if (this.myTests.length == 0) this.empty = true;
      })
      let svg = d3.select("#svg");
      svg.selectAll("rect").remove()
      svg.selectAll("text").remove()
      svg.attr("width", 0).attr("height", 0)
    }
  }

  search() {
    this.testsToShow = new Array<Test>();
    for (let i = 0; i < this.myTests.length; ++i) {
      if (this.myTests[i].name.includes(this.searchPattern)) {
        this.testsToShow.push(this.myTests[i]);
      }
    }
    if (this.testsToShow.length == 0) this.empty = true;
    else this.empty = false;
    this.searchPattern = ""
  }

  deleteTest(test) {
    this.authorService.deleteTest(test).subscribe(doc => {
      console.log(doc)
    })
    let i = 0;
    for (i = 0; i < this.myTests.length; ++i) {
      if (this.myTests[i].name == test.name) {
        for (let j = i; j < this.myTests.length - 1; ++j) {
          this.myTests[j] = this.myTests[j + 1];
        }
        this.myTests.pop();
        break;
      }
    }
    i = 0;
    for (i = 0; i < this.testsToShow.length; ++i) {
      if (this.testsToShow[i].name == test.name) {
        for (let j = i; j < this.testsToShow.length - 1; ++j) {
          this.testsToShow[j] = this.testsToShow[j + 1];
        }
        this.testsToShow.pop();
        break;
      }
    }
    if (this.testsToShow.length == 0) this.empty = true;
    else this.empty = false;

  }

  showResults(test) {
    this.resultsView = true;
    this.currTest = test;
    for (let i = 0; i < 10; ++i) this.stat[i] = 0;
    let max = this.currTest.maxPoints;
    for (let i = 0; i < this.currTest.results.length; ++i) {
      let points = this.currTest.results[i].pointsSum;
      let percentage = (points / max) * 100;
      if (percentage <= 10) {
        ++this.stat[0];
      } else {
        if (percentage <= 20) {
          ++this.stat[1]
        } else {
          if (percentage <= 30) {
            ++this.stat[2];
          } else {
            if (percentage <= 40) {
              ++this.stat[3]
            } else {
              if (percentage <= 50) {
                ++this.stat[4];
              } else {
                if (percentage <= 60) {
                  ++this.stat[5]
                } else {
                  if (percentage <= 70) {
                    ++this.stat[6];
                  } else {
                    if (percentage <= 80) {
                      ++this.stat[7]
                    } else {
                      if (percentage <= 90) {
                        ++this.stat[8]
                      } else {
                        ++this.stat[9];
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (this.currTest.results.length == 0) this.resultsEmpty = true;
    else this.resultsEmpty = false;
    this.grafik();
  }

  grafik() {
    for (let i = 0; i < this.stat.length; ++i) {
      this.stat[i] *= 10;
    }
    let proc = ["0-10%", "11-20%", "21-30%", "31-40%", "41-50%", "51-60%", "61-70%", "71-80%", "81-90%", "91-100%"]

    let svgWidth = 1000, svgHeight = 300, barPadding = 5;
    let barWidth = svgWidth / this.stat.length
    let svg = d3.select("#svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)

    let barChart = svg.selectAll("rect")
      .data(this.stat)
      .enter()
      .append("rect")
      .attr("y", s => {
        return svgHeight - s;
      })
      .attr("height", s => {
        return s;
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", (s, i) => {
        let translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
      })

    let txt = svg.selectAll("text")
      .data(this.stat)
      .enter()
      .append("text")
      .text((s, i) => {
        return (s / 10 + " /" + proc[i])
      })
      .attr("y", (s, i) => {
        return svgHeight - s - 2;
      })
      .attr("x", (s, i) => {
        return barWidth * i + barWidth / 2 - barPadding;
      })
      .attr("class", "svgtxt")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("fill", "#333")

    for (let i = 0; i < this.stat.length; ++i) {
      this.stat[i] /= 10;
    }
  }


  goBack() {
    if (this.resultsView == true) {
      this.resultsView = false;
      let svg = d3.select("#svg");
      svg.selectAll("rect").remove()
      svg.selectAll("text").remove()
      svg.attr("width", 0).attr("height", 0)
    }
    else {
      this.app.navigateHome();
    }
  }


}
