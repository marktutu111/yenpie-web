import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { Observable } from "rxjs";

import * as firebase from "firebase";


@Injectable ()
export class Profile$vice {
    
            profileCache: any;
            moodCache: any;
            profile = new Subject();
            mood = new Subject();
            $userid: string;
            profile$: Observable<any> = this.profile.asObservable();
            mood$: Observable<any> = this.mood.asObservable();

            constructor (private fbDb: AngularFireDatabase) {}



            loadProfile () {


                this.fbDb.object(`/Profiles/${this.$userid}/`)
                         .query
                         .once('value', $user => {

                                this.profileCache = $user.val();
                                this.profile.next($user.val());

                         });


            }




            loadMood () {

                this.fbDb.object(`/Profiles/${this.$userid}/mood`)
                         .query
                         .once('value', $mood => {

                                this.moodCache = $mood.val();
                                this.mood.next($mood.val());

                         })

            }



            setOnline () {

                this.fbDb.object(`/Profiles/${this.$userid}/online`)
                         .set({ date: Date(), value: true })
                         .then(() => {

                                firebase.database().ref(`/Profiles/${this.$userid}/online`).onDisconnect().set({ value: false });

                         });
                            
            }

}