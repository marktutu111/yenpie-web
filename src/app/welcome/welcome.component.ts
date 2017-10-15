import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";




@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['../app.component.css']
})





export class WelcomeComponent implements OnInit {



                constructor (private fbAuth: AngularFireAuth, private router: Router) {}


                ngOnInit () {

                        this.fbAuth.authState.subscribe($user => {

                                    if ($user && $user.uid) this.router.navigate(['home']);
                                    
                        });

                }

}
