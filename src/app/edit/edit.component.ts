import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFireAuth } from "angularfire2/auth";
import { Profile$vice } from "../services/profile.service";
import { Subscription } from "rxjs";



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})




export class EditComponent implements OnInit, OnDestroy {


              cue: Array<any>[] = [];
              savenickname: boolean = false;
              saveage: boolean = false;
              saveprofession: boolean = false;

              nickname: string = "";
              age: string = "";
              profession: string = "";

              $userid: string;
              profile$: any;

              subscription: Subscription;


              constructor (private sanitizer: DomSanitizer,
                           private fbAuth: AngularFireAuth, 
                           private fbDb: AngularFireDatabase,
                           private prof$vice: Profile$vice) {}



              ngOnInit () {

                        try {

                                if (this.prof$vice.$userid) this.$userid = this.prof$vice.$userid;
                                this.subscription = this.prof$vice.profile$.subscribe(($prof: any) => {

                                        this.$userid = this.prof$vice.$userid;
                                        
                                });
                            

                        } catch (error) {
                            
                            
                        }

              }



              saveNickname () {

                    if (this.nickname === "" || this.$userid === undefined) return;
                    this.savenickname = true;
                    this.fbDb.object(`/Profiles/${this.$userid}/`)
                        .update({ nickname: this.nickname})
                        .then(() => {

                            this.savenickname = false;
                            this.nickname = "";

                        }, err => {

                            this.savenickname = false;

                        });

              }



              saveAge () {

                    if (this.age === "" || this.$userid === undefined) return;
                    this.saveage = true;
                    this.fbDb.object(`/Profiles/${this.$userid}/`)
                        .update({ age: this.age})
                        .then(() => {

                            this.saveage = false;
                            this.age = "";

                        }, err => {

                            this.saveage = false;

                        });
                    
              }



              saveProfession () {

                    if (this.profession === "" || this.$userid === undefined) return;
                    this.saveprofession = true;
                    this.fbDb.object(`/Profiles/${this.$userid}/`)
                        .update({ profession: this.profession})
                        .then(() => {

                            this.saveprofession = false;
                            this.profession = "";

                        }, err => {

                            this.saveprofession = false;

                        });

              }




              ngOnDestroy () {

                        this.subscription.unsubscribe();
                  
              }




}
