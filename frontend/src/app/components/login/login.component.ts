import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/models/user';
import { AppComponent } from '../../app.component'
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string;
  password:string;

  message:string;

  constructor(private router: Router, private userService: UsersService, private appComp: AppComponent, private authService: AuthenticationService ) { }

  ngOnInit() {
    this.message="";
    //this.authService.getCurrUser().subscribe((res)=>{
      let currUser = JSON.parse(sessionStorage.getItem('currUser')) //res[0];
      if(currUser){
        if(currUser.type=='admin') this.router.navigate(['admin']);
        if(currUser.type=='author') this.router.navigate(['author']);
        if(currUser.type=='client') this.router.navigate(['client']);
      }
    //})
      
  }

  login():void{
    this.userService.login(this.username,this.password).subscribe((user:User)=>{
      if(user[0]){
        //this.authService.setCurrUser(user[0].username, user[0].type).subscribe(res=>{
          sessionStorage.setItem('currUser',JSON.stringify({username: user[0].username,type: user[0].type}));
          this.appComp.ngOnInit();
          if(user[0].type == "client"){
            this.router.navigate(['client']);
          }else{
            if(user[0].type=="author"){
              this.router.navigate(['author']);
            }
            else{
              this.router.navigate(['admin']);
            }
          }
        //})
      }
      else{
        this.message="Pogresno ste uneli korisnicko ime ili lozinku";
      }
    });
  }


}
