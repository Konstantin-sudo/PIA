import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userViews: boolean;
  requestViews: boolean;
  addUserView: boolean;
  newUser: User;
  users: any;
  requests: any;

  requestsEmpty = false;
  usersEmpty = false;


  msg: string;

  constructor(private router: Router, private adminService: AdminService, private authService: AuthenticationService, public app: AppComponent) { }

  ngOnInit() {
    this.authService.check("admin");
    this.newUser = new User();
    this.newUser.birth_date = null;
    this.newUser.type = "";
    this.adminService.getUsers(this.app.currUser.username).subscribe(users => {
      this.users = users;
      if (this.users.length == 0) this.usersEmpty = true;
    })
    this.adminService.getRequests().subscribe(requests => {
      this.requests = requests;
      if (this.requests.length == 0) this.requestsEmpty = true;

    })

  }

  showUsers() {
    //this.adminService.getUsers(this.currUser.username).subscribe(users=>{
    // this.users = users; //radi
    this.addUserView = false;
    this.requestViews = false;
    this.userViews = true;
    //this.ngOnInit();
    //});
  }

  showRequests() {
    //this.adminService.getRequests().subscribe(requests=>{
    //this.requests=requests; //radi :)
    this.addUserView = false;
    this.userViews = false;
    this.requestViews = true;
    //this.ngOnInit();
    //});
  }

  showAddUser() {
    this.addUserView = true;
    this.userViews = false;
    this.requestViews = false;
    //this.ngOnInit();
  }

  deleteUser(username) {
    this.adminService.deleteUser(username).subscribe(respond => {
      //this.showUsers();
    });
    let i = 0;
    for (i; i < this.users.length; ++i) {
      if (this.users[i].username == username) break;
    }
    for (let j = i; j < this.users.length - 1; ++j) {
      this.users[j] = this.users[j + 1];
    }
    this.users.pop();
    if (this.users.length == 0) this.usersEmpty = true;
    else this.usersEmpty = false;
    this.showUsers();
  }

  updateUser(user: any) {
    if(!user.password.match(/^([a-zA-Z].*)(?=.*[0-9])(?=.*[A-Z])(?=.*\W).{7,}$/)){
      this.msg="Pogresan format lozinke"
    }else{
      if(!user.id.match(/^([0-2]\d|3[0,1])(0\d|1[0,1,2])(\d{9})$/)){
        this.msg="Pogresan format jmbg broja"
      }else{
        if(!user.phone.match(/^(\d{9}\d?\d?$)|(\+381\d{8}\d?\d?$)/)){
          this.msg="Pogresan broj kontakt telefona"
        }
        else{
          this.adminService.updateUser(user).subscribe(respond => {
            if (respond['msg'] == 'ok') {
              this.msg = "Korisnik uspesno azuriran";
              let i = 0;
              for (i; i < this.users.length; i++) {
                if (this.users[i]._id == user._id) {
                  this.users[i] = user;
                  break;
                }
              }
            }
            else {
              if (respond['msg'] == 'too many') this.msg = "Previse naloga sa trazenim majlom";
              else {
                if (respond['msg'] == 'not available') this.msg = "Korisnicko ime je zauzeto";
                else this.msg = "Korisnik nije azuriran";
              }
            }
            this.showUsers();
          });
        }
      }
    }
    
  }

  denyRequest(username: string) {
    this.adminService.denyRequest(username).subscribe(respond => {
      //this.showRequests();
    });
    let i = 0;
    for (i; i < this.requests.length; ++i) {
      if (this.requests[i].username == username) break;
    }
    for (let j = i; j < this.requests.length - 1; ++j) {
      this.requests[j] = this.requests[j + 1];
    }
    this.requests.pop();
    if (this.requests.length == 0) this.requestsEmpty = true;
    else this.requestsEmpty = false;
    this.showRequests();
  }

  approveRequest(username: string) {
    this.adminService.approveRequest(username).subscribe(msg => {
      if (msg['msg'] == 'ok') this.msg = "odobren zahtev";
      else this.msg = "greska";
      //this.showRequests();
    })
    let i = 0;
    for (i; i < this.requests.length; i++) {
      if (this.requests[i].username == username) {
        this.users.push(this.requests[i]);
        this.usersEmpty = false;
        break;
      }
    }
    for (let j = i; j < this.requests.length - 1; ++j) {
      this.requests[j] = this.requests[j + 1];
    }
    this.requests.pop();
    if (this.requests.length == 0) this.requestsEmpty = true;
    else this.requestsEmpty = false;
    this.showRequests();

  }

  addUser() {
    this.adminService.addNewUser(this.newUser).subscribe(respond => {
      if (respond['msg'] == 'ok') {
        this.msg = "Korisnik uspesno dodat u sistem";
        let u = {
          _id: respond['_id'],
          name: this.newUser.name,
          surname: this.newUser.surname,
          username: this.newUser.username,
          password: this.newUser.password,
          birth_date: this.newUser.birth_date,
          birth_place: this.newUser.birth_place,
          id: this.newUser.id,
          phone: this.newUser.phone,
          mail: this.newUser.mail,
          type: this.newUser.type,
          finishedSurveys: Array<{ name: string, answers: Array<Array<string>> }>(),
          savedSurveys: Array<{ name: string, answers: Array<Array<string>> }>(),
          finishedTests: Array<{ name: string, answers: Array<Array<string>> }>()
        }
        this.users.push(u);
        this.usersEmpty = false;
      }
      else {
        if (respond['msg'] == 'too many') this.msg = "Previse naloga sa trazenim majlom";
        else {
          if (respond['msg'] == 'not available') this.msg = "Korisnicko ime je zauzeto";
          else this.msg = "Korisnik nije dodat u sistem";
        }
      }
    });
  }




}
