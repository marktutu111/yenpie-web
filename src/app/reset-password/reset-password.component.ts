import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../app.component.css']
})




export class ResetPasswordComponent {

          email: string = '';
          constructor (private fb: AngularFireAuth) {}

          reset () {

                if (this.email === "") return;
                this.fb.auth
                    .sendPasswordResetEmail(this.email)
                    .then(() => {
                          alert('password reset senrt');
                    }, err => {

                           alert(err);
                    });

          }

}
