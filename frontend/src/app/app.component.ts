import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'projekatPIA';
  currUser = {
    username: "",
    type: ""
  }
  currUserDetails: any;
  logedin: boolean = false;
  currTitle: string;

  constructor(private router: Router, private userService: UsersService) { }

  ngOnInit() {
    //this.authService.getCurrUser().subscribe(res=>{
    this.currUser = JSON.parse(sessionStorage.getItem('currUser')) //res[0];
    this.logedin = true;
    if (!this.currUser) {
      this.logedin = false;
      this.currUser = {
        username: "",
        type: ""
      }
      this.currUserDetails = null;
    } else {
      if (this.currUser.type == "admin")
        this.currTitle = "Admin"
      if (this.currUser.type == "client")
        this.currTitle = "Ispitanik"
      if (this.currUser.type == "author")
        this.currTitle = "Autor"
      this.userService.getUser(this.currUser.username).subscribe(user => {
        this.currUserDetails = user[0];
      })
    }
    // })
  }

  navigateHome() {
    if (this.currUser.username == "") this.router.navigate(['']);
    if (this.currUser.type == "admin") this.router.navigate(['admin']);
    if (this.currUser.type == "author") this.router.navigate(['author']);
    if (this.currUser.type == "client") this.router.navigate(['client']);
  }

  navigateLogin() {
    //this.authService.deleteCurrUser().subscribe(res=>{
    sessionStorage.clear();
    this.currUser.username = "";
    this.currUser.type = "";
    this.logedin = false;
    this.router.navigate(['']);
    //});
  }

  updateUsersDetails(user) {
    this.currUserDetails = user;
  }


  ngOnDestroy() {
    sessionStorage.clear();
    //this.authService.deleteCurrUser(); // ne radi
  }

  getUserService() {
    return this.userService
  }
}
