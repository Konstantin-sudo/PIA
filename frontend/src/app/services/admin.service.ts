import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url='http://localhost:4000';

  constructor(private http: HttpClient) { }

  getUsers(username){
    const data = {
      username: username
    }
    return this.http.post(`${this.url}/admin/getUsers`,data);
  }
  
  getRequests(){
    return this.http.get(`${this.url}/admin/getRequests`);
  }
  
  deleteUser(username:string){
    const data ={
      username:username
    }
    return this.http.post(`${this.url}/admin/deleteUser`,data);
  }
  
  denyRequest(username:string){
    const data ={
      username:username
    }
    return this.http.post(`${this.url}/admin/denyRequest`,data);
  }
  
  approveRequest(username:string){
    const data ={
      username:username
    }
    return this.http.post(`${this.url}/admin/approveRequest`,data);
  }
  
  addNewUser(user:User){
    const data = {
      user:user
    }
    return this.http.post(`${this.url}/admin/addNewUser`,data);
  }
  
  updateUser(user:any){
    const data = {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      username: user.username,
      password: user.password,
      birth_date: user.birth_date,
      birth_place: user.birth_place,
      id: user.id,
      phone: user.phone,
      mail: user.mail,
      type: user.type
    }
    return this.http.post(`${this.url}/admin/updateUser`,data);
  }
  


}
