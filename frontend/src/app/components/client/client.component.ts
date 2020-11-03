import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.check("client");
    /*//this.authService.getCurrUser().subscribe(res=>{
      let curr = JSON.parse(sessionStorage.getItem('currUser'))//res[0];
      if(!curr){
        this.router.navigate(['']);
      }else{
        if(curr.type=='author') this.router.navigate(['author']);
        if(curr.type=='admin') this.router.navigate(['admin']);
      }
    //})*/
  }

  showSurveys(){
    this.router.navigate(['client/surveys']);
  }
  showTests(){
    this.router.navigate(['client/tests']);
  }

}
