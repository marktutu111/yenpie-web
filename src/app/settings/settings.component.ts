import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Profile$vice } from "../services/profile.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../createmood/createmood.component.css']
})





export class SettingsComponent implements OnInit, OnDestroy {


                  photo$: any;
                  loggingOut: boolean = false;
                  subscription: Subscription;
                  savephoto: boolean = false;
                  $userid: string;

                  constructor (private fbAuth: AngularFireAuth, 
                               private prof$vice: Profile$vice,
                               private sanitizer: DomSanitizer,
                               private fbDb: AngularFireDatabase,
                               private router: Router) {}



                  ngOnInit () {

                        this.fbAuth.authState.subscribe($user => {

                                    if ($user && $user.uid) {

                                          this.$userid = $user.uid;   
                                          this.prof$vice.$userid = $user.uid;
                                          this.prof$vice.loadMood();
                                          this.prof$vice.loadProfile();
                                          this.subscription = this.prof$vice.profile$.subscribe(($prof: any) => { this.photo$ = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $prof.photo)});

                                    } else { return this.router.navigate(['welcome']) }
                                    
                        })

                  }

                  

                  logout () {

                        this.loggingOut = true;
                        this.fbAuth.auth.signOut()
                                   .then(() => {

                                          this.loggingOut = false;
                                          this.router.navigate(['welcome']);

                                   }) 

                  }




                  fileChangeEvent (fileInput: any) {

                        if (this.$userid) {

                                    if (fileInput.target.files && fileInput.target.files[0]) {

                                          let reader = new FileReader();
                                          reader.onload = (e: any) => {

                                                      this.photo$ = e.target.result;
                                                      let $photoString = this.photo$.split(',')[1];

                                                      this.savephoto = true;
                                                      this.fbDb.object(`/Profiles/${this.$userid}/`)
                                                            .update({ photo: $photoString })
                                                            .then(() => {

                                                                  this.savephoto = false;

                                                            })
                                          }

                                          reader.readAsDataURL(fileInput.target.files[0]);
                                          
                                    }

                        }

                  }





                  ngOnDestroy () {

                        try {

                              this.subscription.unsubscribe();
                              
                        } catch (error) {
                              
                        }

                  }




}
