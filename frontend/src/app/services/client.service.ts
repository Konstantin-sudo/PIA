import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url='http://localhost:4000';

  constructor(private http: HttpClient) { }

  //SURVEYS
  getSurveys(){
    return this.http.get(`${this.url}/client/get/surveys`);
  }
  getSurvey(name){
    const data = {
      name:name
    }
    return this.http.post(`${this.url}/client/get/survey`,data);
  }
  endSurvey(survey){
    const data={
      survey: survey
    }
    return this.http.post(`${this.url}/client/surveys/end`,data);
  }
  saveSurvey(survey){
    const data={
      survey: survey
    }
    return this.http.post(`${this.url}/client/surveys/save`,data);
  }
  getUserDetails(username){
    const data={
      username:username
    }
    return this.http.post(`${this.url}/client/surveys/get/user`,data);
  }
  updateUser(user){
    const data={
      user:user
    }
    return this.http.post(`${this.url}/client/surveys/set/user/update`,data);
  }
  //TESTS
  getTests(){
    return this.http.get(`${this.url}/client/get/tests`);
  }
  getTest(name){
    const data = {
      name:name
    }
    return this.http.post(`${this.url}/client/get/test`,data);
  }
  endTest(test){
    const data = {
      test:test
    }
    return this.http.post(`${this.url}/client/tests/end`,data);
  }
}
