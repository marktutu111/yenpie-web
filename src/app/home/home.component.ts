import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import { FriendsService } from "../services/friends.service";
import { MoodService } from "../services/moods.service";
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from "rxjs";
import { Profile$vice } from "../services/profile.service";
import { CallService } from "../services/webrtc.service";





@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css', '../app.component.css']
})





export class HomeComponent implements OnInit {


              $userid: string;
              chat: boolean = false;
              $requests: Array<any>[] = [];
              $messages: Array<any>[] = [];
              searchList$: Array<any>[] = [];
              $messagesCount: any = 0;
              search: boolean;
              searchWord: string = "";
              onSearch: any;
              moodnull$toast: any;
              moodnull$ubscription: Subscription;
              options = {
                  position: ["bottom", "right"],
                  lastOnBottom: true
              }



              constructor (private fbAuth: AngularFireAuth, 
                           private router: Router,
                           private ngNotf: NotificationsService,
                           private route: ActivatedRoute,
                           private fbDb: AngularFireDatabase,
                           private mood$vice: MoodService,
                           private profile$vice: Profile$vice,
                           private call$vice: CallService,
                           private friend$vice: FriendsService) {}



              ngOnInit () {


                        this.fbAuth.authState.subscribe(($user) => {

                                    if (!$user && !$user.uid) {

                                          return this.router.navigate(['welcome'])

                                    } else {

                                          this.$userid = $user.uid;
                                          this.profile$vice.$userid = this.$userid;
                                          this.call$vice.$userid = this.$userid;
                                          this.profile$vice.setOnline();
                                          this.getRequests();
                                          this.getMessages();
                                    }
                        });


                        this.moodnull$ubscription = this.mood$vice.userMoodNull$.subscribe(($val) => {


                                    let options = {
                                                timeOut: 0,
                                                clickToClose: false,
                                                showProgressBar: false
                                          }


                                    try {

                                          if ($val === null) {

                                                let title: string = 'Oops! Mood is not set.',
                                                    content: string = 'No body can see you, click to create a mood and reach friends now.';

                                                this.moodnull$toast = this.ngNotf.error(title, content, options);
                                                this.moodnull$toast.click.subscribe(() => { 
                                                      this.router.navigate([ 'home' , { 'outlets' : { '0' : ['profile']} }])
                                                })

                                                return;

                                          }


                                          if ($val && $val.photo === null) {

                                                if (this.moodnull$toast) this.ngNotf.remove(this.moodnull$toast);
                                                let title: string = 'Oops! Set your mood photo.',
                                                    content: string = 'Friends would react to your mood base on your photo.';

                                                this.moodnull$toast = this.ngNotf.error(title, content, options);
                                                this.moodnull$toast.click.subscribe(() => { 
                                                      this.router.navigate([ 'home' , { 'outlets' : { '0' : ['profile']} }])
                                                })
                                                return;

                                          }


                                          if ($val && $val.description === null) {

                                                if (this.moodnull$toast) this.ngNotf.remove(this.moodnull$toast);
                                                let title: string = 'Oops! Set your mood description.',
                                                    content: 'Describe your mood in words, people would understand you better.';
                                                    
                                                this.moodnull$toast = this.ngNotf.error(title, content, options);
                                                this.moodnull$toast.click.subscribe(() => { 
                                                      this.router.navigate([ 'home' , { 'outlets' : { '0' : ['profile']} }])
                                                })
                                                return;
                                          }


                                          this.ngNotf.remove(this.moodnull$toast);
                                          this.moodnull$ubscription.unsubscribe();
                                          
                                          

                                    } catch (err) {

                                          
                                    }

                        });



              }



              /**
               *  LISTEN FOR NEW MESSAGES AND REQUEST
               */ 
              getRequests () {

                    this.fbDb.object(`/Profiles/${this.$userid}/requests/`)
                             .query
                             .on('child_added', ($d) => {

                                          this.friend$vice.loadfriendProfile($d, ($profile) => {
                                                
                                                      this.$requests.push($profile);
                                                       
                                                
                                                });
                                    

                             })

              }




              getMessages () {

                        this.friend$vice.friends$.filter(($friend: any) => {
                                    let path: string;
                                    if ($friend.isSender) {

                                          path = `/Relations/${this.$userid}/${$friend.key}/messages/${this.$userid}/`

                                          }  else  {

                                          path = `/Relations/${$friend.key}/${this.$userid}/messages/${this.$userid}/`

                                    }
                                                      
                                    this.fbDb.object(path)
                                          .query
                                          .on('child_added', $d => {

                                                      if ($d.val()) {
                                                            
                                                            for (var key in $d.val()) {

                                                                  let $count = $d.val()[key].count;
                                                                  this.$messages.push($count);
                                                                  
                                                            }
                                                            
                                                      }

                                                      this.$messagesCount = this.$messages.reduce(this.sumMessages)

                                          })
                        })
                
              }




              sumMessages (a, b) { return a + b };



              searchMoods ($word: string) {
                        
                        if ($word === "") return this.searchList$.length = 0;
                        this.mood$vice.loadMoods(($f: any) => {

                                    try {
                                          
                                          if ($f.name.toUpperCase().indexOf($word.toUpperCase()) > -1) {

                                                this.mood$vice.checkfriendship($f, ($found) => {
                                                      
                                                      this.searchList$.push($found);

                                                })
                                                

                                          }

                                    } catch (error) {

                                          
                                    }
                              

                        });

              }




}
