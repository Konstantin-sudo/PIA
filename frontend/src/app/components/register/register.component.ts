import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  passwordconf = "";
  message: string = "";
  recaptcha: any[];

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    let curr = JSON.parse(sessionStorage.getItem('currUser'));
    if (curr) this.router.navigate(['']);
    this.message = "";
    //if(this.user) delete this.user;
    this.user = new User();
    this.user.birth_date = null;
    this.user.type = "client";
  }

  register(): void {
      if (this.passwordconf == this.user.password) {
        this.service.register(this.user,this.recaptcha).subscribe(request => {
          if (request['request'] == 'ok') {
            this.message = 'Zahtev za registraciju uspesno poslat';
          } else {
            if (request['request'] == 'not available')
              this.message = 'Korisnicko ime je zauzeto';
            else {
              if (request['request'] == 'too many')
                this.message = 'Previse naloga sa trazenim mejlom';
              else {
                if (request['request'] == 'recaptcha empty') {
                  this.message = "Morate potvrditi polje 'recaptcha'"
                } else {
                  if (request['request'] == 'recaptcha failed') {
                    this.message = "Verifikacija polja 'recaptcha' nije uspela"
                  } else
                    if (request['request'] == 'image error') {
                      this.message = "Slika nije u dobrom formatu";
                    } else {
                      this.message = 'Zahtev za registraciju nije poslat';
                    }
                }
              }
            }
          }
        });
      }

    
  }

  checkPass() {
    if (this.passwordconf != this.user.password) {
      return false;
    }
    else {
      return true;
    }
  }

  resolved(captchaResponse: any[]) {
    this.recaptcha = captchaResponse;
  }

  handleFileInput(files: FileList) {
    this.user.picture = files.item(0);
  }





}
