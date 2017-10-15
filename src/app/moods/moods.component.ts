import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as moment from "moment";
import { MoodService } from "../services/moods.service";





@Component({
  selector: 'app-moods',
  templateUrl: './moods.component.html',
  styleUrls: ['./moods.component.css']
})







export class MoodsComponent implements OnInit {


                    moods$: Array<any[]> = [];
                    $userid: any;
                    $userCache: any;



                    constructor (private fbDb: AngularFireDatabase, 
                                 private fbAuth: AngularFireAuth,
                                 private sanitizer: DomSanitizer,
                                 private md$vice: MoodService) {}


                    ngOnInit () {
    
                            this.fbAuth.authState.subscribe($user => {

                                        if ($user && $user.uid) {
                                                this.$userid = $user.uid;
                                                this.md$vice.$userid =$user.uid;
                                                this.md$vice.loadMoods();
                                                this.moods$ = this.md$vice.moods$;
                                                return;
                                        }
                            });
                            
                    }
                    





                    sendRequest ($i) {

                                let $match = this.moods$.filter(($user: any, $index) => {
                                        if ($index === $i) {
                                                $user.requested = true;
                                                return $user;
                                        }
                                })

                                if ($match[0]) {
                                        let $user: any = $match[0];
                                        this.fbDb.object(`/Profiles/${$user.key}/requests/${this.$userid}`)
                                                 .update({ date: Date()})
                                                 .then(() => {

                                                        let pushData = {

                                                                notification: {
                                                                        body: 'I sent you a friend request',
                                                                        title: 'nickname',
                                                                        sound: 'default'
                                                                },
                                                                data: {
                                                                        type: 'request'  
                                                                },
                                                                content_available: true,
                                                                priority: "high",
                                                                to: $user.pushToken
                                                        }

                                                        // push.send(pushData);

                                                 }, err => {

                                                        this.moods$.filter(($user: any, $index) => {
                                                                if ($index === $i) return $user.requested = false;
                                                        });

                                                 });
                                        
                                }
                                
                    }




                    cancelRequest ($i) {

                                let $match = this.moods$.filter(($user: any, $index) => {
                                        if ($index === $i) {
                                                $user.requested = false;
                                                return $user;
                                        }
                                });


                                if ($match[0]) {
                                        let $user: any = $match[0];
                                        this.fbDb.object(`/Profiles/${$user.key}/requests/${this.$userid}`)
                                                 .remove()
                                                 .then(() => {
                                                         //..Request removed.
                                                 }, err => {

                                                        this.moods$.filter(($user: any, $index) => {
                                                                if ($index === $i) $user.requested = false;
                                                        });

                                                 });
                                }

                    }



}
