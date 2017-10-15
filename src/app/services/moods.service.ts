import { AngularFireDatabase } from "angularfire2/database";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";




@Injectable ()

export class MoodService {


            moods$: Array<any[]> = [];
            $userid: string;
            $userMoodNull = new Subject();
            userMoodNull$: Observable<any> = this.$userMoodNull.asObservable();


            constructor (private fbDb: AngularFireDatabase,
                        private sanitizer: DomSanitizer) {}




            loadMoods (callback?) {

                    this.fbDb.list('/Profiles')
                             .query
                             .limitToLast(50)
                             .once('value', ($d) => {

                                        if ($d.val()) {
                                                
                                            for (var key in $d.val()) {
                                                    
                                                    if (key && key !== this.$userid) {

                                                        var $user = $d.val()[key];    
                                                            $user.name = `${$user.nickname || ""} - ${$user.age || ""}`;
                                                            $user.profession ? $user.profession : $user.profession = "";
                                                            $user.key = key;
                                                            


                                                            // CHECK IF I SENT PERSON A REQUEST
                                                            if ($user.requests) {

                                                                    for (var key in $user.requests) {

                                                                            if (key === this.$userid) { 

                                                                                    $user.requested = true;

                                                                            } else {

                                                                                    $user.requested = false;
                                                                            }

                                                                    }

                                                            } else { $user.requested = false;};


                                                            // LOAD USER MOOD
                                                            if ($user.mood) {

                                                                    let $mood = $user.mood;
                                                                    $mood.description ? $user.description = $mood.description : $user.description = "";
                                                                    $mood.photo ? $user.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $mood.photo) : $user.photo = "";
                                                                    $mood.createdAt ? $user.mood_created = moment(new Date($mood.createdAt)).fromNow() : $user.mood_created = "";

                                                            } else {

                                                                    $user.description = "";
                                                                    $user.mood_created = "";
                                                                    $user.photo = "";

                                                            }

                                                            if (callback) {

                                                                    callback ($user);

                                                            }  else  {

                                                                    this.checkfriendship($user);

                                                            }


                                                    }  else  {
                                                            
                                                                // Current user profile.
                                                                let $user = $d.val()[this.$userid];
                                                                if (!$user.mood) {

                                                                        this.$userMoodNull.next(null);

                                                                } else  {

                                                                        if (!$user.mood.photo) this.$userMoodNull.next({photo: null});
                                                                        if (!$user.mood.description) this.$userMoodNull.next({description: null});

                                                                }

                                                    }

                                            }

                                    }

                            });


                    }










                    checkfriendship ($user, callback?) {

                            this.fbDb.list('/Relations/')
                                     .query
                                     .limitToLast(50)
                                     .once('value', ($d) => {

                                              if ($d.val() !== null) {

                                                      for (var key in $d.val()) {

                                                              var $friends = $d.val()[key];
                                                                  $friends.key = key;
                                                              
                                                                  if ($friends.key === $user.key && $friends.sender === this.$userid || 
                                                                              $friends.sender === $user.key && $friends.key === this.$userid) {

                                                                                      $user.friend = true;

                                                                              } else {

                                                                                      $user.friend = false;

                                                                  }

                                                      }
                                              }


                                              if (callback) {

                                                    callback($user);

                                              } else {

                                                    this.moods$.push($user);

                                              }
                                              

                                      });


                    }


                    



}