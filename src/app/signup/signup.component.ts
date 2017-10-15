import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../app.component.css']
})




export class SignupComponent implements OnInit {

            email: string = "";
            password: string = "";
            nickname: string = "";
            profession: string = "";
            age: string = "";

            constructor (private fbAuth: AngularFireAuth, 
                         private fbDb: AngularFireDatabase,
                         private router: Router) {}


            ngOnInit() {}


            send () {

                  if (this.email === "" || this.password === "" || this.nickname === "" 
                      || this.profession === "" || this.age === "") return;


                  this.fbAuth
                      .auth
                      .createUserWithEmailAndPassword(this.email,this.password)
                      .then((user) => {

                              let userid = user.uid;
                              this.fbDb.object(`/Profiles/${userid}`)
                                  .update({ nickname: this.nickname,
                                            profession: this.profession,
                                            age: this.age,
                                            date: Date() })

                                  .then(() => {

                                        alert('Saved!');
                                        this.router.navigate(['/home']);

                                  }, err => {

                                        alert(err);

                                  });

                      }, err => {

                              console.log(err);
                              
                      });


            }



}
