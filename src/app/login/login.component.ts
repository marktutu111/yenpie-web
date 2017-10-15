import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.css']
})




export class LoginComponent  {

          busy: boolean = false;
          email: string = "";
          password: string = "";



          constructor (private fbAuth: AngularFireAuth, private router: Router) {};


          send () {

                  if (this.email === "" || this.password === "") return;
                  this.busy = true;

                  this.fbAuth
                      .auth
                      .signInWithEmailAndPassword(this.email, this.password)
                      .then(res => {
                            this.busy = false;
                            this.router.navigate(['home']);
                      }, err => {
                            this.busy = false;
                            alert(err); 
                      });

          }

}
