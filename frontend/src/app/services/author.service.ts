import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
 
  url='http://localhost:4000';
  
  constructor(private http: HttpClient) { }

  //SURVEYS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getSurveys(){
    return this.http.get(`${this.url}/author/get/surveys`);
  }
  getSurvey(name){
    const data = {
      name:name
    }
    return this.http.post(`${this.url}/author/get/survey`,data);
  }
  endSurvey(survey){
    const data={
      survey: survey
    }
    return this.http.post(`${this.url}/author/surveys/end`,data);
  }

  saveNewSurvey(survey){
    const data={
      survey: survey
    }
    return this.http.post(`${this.url}/author/surveys/save/new`,data);
  }

  getUserDetails(username){
    const data={
      username:username
    }
    return this.http.post(`${this.url}/author/surveys/get/user`,data);
  }

  getMySurveys(username){
    const data={
      username:username
    }
    return this.http.post(`${this.url}/author/surveys/get/mysurveys`,data);
  }

  deleteSurvey(survey){
    const data ={
      survey:survey
    }
    return this.http.post(`${this.url}/author/surveys/delete/survey`,data);
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  updateUser(user){
    const data={
      user:user
    }
    return this.http.post(`${this.url}/author/user/update`,data);
  }
  getQuestions(){
    return this.http.get(`${this.url}/author/get/questions`);
  }
  updateQuestions(questions){
    const data={
      questions:questions
    }
    return this.http.post(`${this.url}/author/update/questions`,data);
  }
//TESTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
saveNewTest(test){
  const data={
    test: test
  }
  return this.http.post(`${this.url}/author/tests/save/new`,data);
}
getTests(username){
  const data={
    username:username
  }
  return this.http.post(`${this.url}/author/get/tests`,data);
}
getTest(name){
  const data = {
    name:name
  }
  return this.http.post(`${this.url}/author/get/test`,data);
}

endTest(test){
  const data = {
    test:test
  }
  return this.http.post(`${this.url}/author/tests/end`,data);
}
getMyTests(username){
  const data={
    username:username
  }
  return this.http.post(`${this.url}/author/tests/get/mytests`,data);
}
deleteTest(test){
  const data ={
    test:test
  }
  return this.http.post(`${this.url}/author/tests/delete/test`,data);
}


}
