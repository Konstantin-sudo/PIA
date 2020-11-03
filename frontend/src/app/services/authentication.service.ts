import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currUser ={
    username: "",
    type: ""
  }

  url='http://localhost:4000';
  
  constructor(private http: HttpClient, private router: Router) { 
    
  }

  check(type){
    let curr = JSON.parse(sessionStorage.getItem('currUser'))//res[0];
    if(!curr){
      this.router.navigate(['']);
      return false;
    }else{
      if(curr.type!=type) {
        this.router.navigate(['']);
        return false;
      }/*if(curr.type=='client') this.router.navigate(['client']);
      if(curr.type=='admin') this.router.navigate(['admin']);
      */
    }
    return true;
  }
/*
  getCurrUser(){
   return this.http.get(`${this.url}/authentication/get`);
  }

  setCurrUser(username, type){
    const data = {
      username: username,
      type: type
    }
    return this.http.post(`${this.url}/authentication/set`, data);
  }

  deleteCurrUser(){
    return this.http.get(`${this.url}/authentication/delete`);
  }
*/

  
}