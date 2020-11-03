import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passchange',
  templateUrl: './passchange.component.html',
  styleUrls: ['./passchange.component.css']
})
export class PasschangeComponent implements OnInit {

  oldpassConf: boolean;
  oldpass: string;
  newpass1: string;
  newpass2: string;
  msg: string;

  constructor(private userService: UsersService, private auth: AuthenticationService, private app: AppComponent, private router: Router) { }

  ngOnInit() {
    let curr = JSON.parse(sessionStorage.getItem('currUser'))//curr[0].username;
    if (!curr) this.router.navigate(['']);
    this.oldpassConf = false;
    this.oldpass = "";
    this.newpass1 = ""
    this.newpass2 = ""
  }

  changePass() {
    if (this.newpass1 == this.newpass2) {
      let curr = JSON.parse(sessionStorage.getItem('currUser'))//curr[0].username;
      this.userService.changePass(curr.username, this.oldpass, this.newpass1).subscribe(res => {
        if (res['msg'] == 'ok') {
          alert("Lozinka uspesno promenjena");
          this.oldpassConf = true;
          this.app.navigateLogin();
        } else {
          this.msg = "Nije dobra stara lozinka"
          this.oldpassConf = false;
        }
      })
    }
  }

}
