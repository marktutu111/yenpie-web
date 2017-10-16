import { Component, AfterViewInit, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { FriendsService } from "../services/friends.service";
import { ActivatedRoute,Router } from "@angular/router";
import { Location } from "@angular/common";
import { ChatviewComponent } from "../chatview/chatview.component";
import { Subscription } from "rxjs";
import { CallService } from "../services/webrtc.service";

import * as firebase from "firebase";


// REQUEST INTERFACE
interface Request {
      nickame: string;
      key: string;
      photo: string;
      profession: string;
      age: string;
      id: string;
      isSender: boolean;
      pushToken: string;
      chats: any;
}




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})




export class ChatComponent implements AfterViewInit, OnDestroy {


              contacts$: Array<any>[] = [];
              chats$: Array<any>[] = [];
              message: string = "";
              $userid: string = "";
              $request: Request;
              personActive: boolean = false;
              $photo: string = "";
              nickname: string = '';
              chatloaded: boolean = false;
              search: string = "";
              searchList$: Array<any>[] = [];
              personIsTyping: boolean = false;
              @ViewChild (ChatviewComponent) chatviewComponent: ChatviewComponent;

              onCall: boolean = false;
              oncallSubscription: Subscription;
              messageSubscription: Subscription;


              constructor (private fbAuth: AngularFireAuth, private sanitizer: DomSanitizer,
                           private fbDb: AngularFireDatabase,
                           private route: ActivatedRoute,
                           private friend$vice: FriendsService,
                           private router: Router,
                           private call$vice: CallService,
                           private location: Location) {}




              ngAfterViewInit () {
                        
                      this.fbAuth.authState.subscribe( $user => {

                                if ($user && $user.uid) {

                                        this.$userid = $user.uid;
                                        this.friend$vice.$userid = $user.uid;
                                        this.friend$vice.loadFriends($friend => {
                                                this.friend$vice.loadfriendProfile($friend, ($d) => {
                                                        
                                                        this.friend$vice.loadChat($friend, ($d) => {

                                                                let $first: any = this.contacts$[0];
                                                                this.personTYping($d);
                                                                this.getnewMessages($d);


                                                                if (!this.chatloaded) {
                                                                        this.$request = $first;
                                                                        this.loadChat();
                                                                        this.status();
                                                                }
                                                                
                                                                this.chatloaded = true;
                                                                
                                                        })

                                                });

                                        });
                                        
                                        
                                        this.oncallSubscription = this.call$vice.onConn$().subscribe($d => {

                                                this.onCall = true;

                                        })

                                }

                      });



                      this.contacts$ = this.friend$vice.friends$;


              }




            status () {

                  // SET PERSON ACTIVE OR MESSAGES SEEN
                  this.fbDb.object(`/Chats/${this.$request.id}/active/${this.$userid}/`).set(true);

                  if (this.$request.isSender) {
                        this.fbDb.object(`/Relations/${this.$userid}/messages/${this.$userid}/`)
                                 .remove();
                  } else {
                        this.fbDb.object(`/Relations/${this.$request.key}/messages/${this.$userid}`)
                                .remove();
                  }

                  // CHECK IF PERSON IS ACTIVE ON MY CHAT 
                  this.fbDb.object(`/Chats/${this.$request.id}/active/${this.$request.key}/`)
                           .valueChanges()
                           .subscribe((res: boolean) => {

                                        this.personActive = res;

                              });
            }
                




            appendChat ($cht) {

                        try {

                                $cht.messageBy === this.$userid ? $cht.isRight = true : $cht.isLeft = true;
                                if ($cht.type === 'text') {

                                        $cht.text = true;
                                        this.setContactLastMessage($cht);

                                } else if ($cht.type === 'emoji') {

                                        $cht.emoji = true;
                                        this.setContactLastMessage('...');

                                } else {

                                        $cht.image = true;
                                        $cht.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $cht.photo);
                                        this.setContactLastMessage('...');
                                }

                                $cht.date = moment(new Date($cht.date)).format('dd hh:mm');
                                this.chats$.push($cht);
                                this.chatviewComponent.scrolltoBottom();

                                
                        } catch (error) {


                                
                        }
                        
              }



              setContactLastMessage (chat: any) {
                      
                        this.contacts$.filter(($cont: any) => {

                                if ($cont.key === this.$request.key) {

                                        $cont.lastMessage = chat.message;
                                        if (chat.date) $cont.message$date = moment(new Date(chat.date)).format('LT');

                                }
                        })
              }





            getRequest ($key) {

                    let $match: any = this.contacts$.filter(($contact: any) => {
                                if ($contact.key === $key) {
                                        $contact.messages = 0;
                                        return $contact;
                                }
                    });
                        
                    return this.$request = $match[0];
                    
            }





            loadChat () {

                        if (this.$request) {

                                this.chats$.length = 0;
                                this.fbDb.list(`/Chats/${this.$request.id}/messages`)
                                         .query
                                         .on('child_added', (result) => {
                                                
                                                if (result.val()) {

                                                        this.appendChat(result.val());

                                                }

                                          })

                        }

                        

            }




            openChat ($key) {

                    try {

                        // REMOVE EVENTLISTENER FROM PREVIOUS
                        this.fbDb.list(`/Chats/${this.$request.id}/messages`).query.off('child_added');

                        this.searchList$.length = 0;
                        let $url = this.router.url.split('?')[0];
                        this.location.replaceState($url, $key);
                        this.getRequest($key);
                        this.loadChat();

                        this.fbDb.object(`/Chats/${this.$request.id}/active/${this.$userid}/`)
                                 .set(false)
                                 .then(() => {

                                        this.status();
                                        firebase.database().ref(`/Chats/${this.$request.id}/active/${this.$userid}/`).onDisconnect().set(false);

                                 });
                            
                    } catch (error) {

                            
                    }    

            }



            searchContacts (val) {

                        if (val === "") return this.searchList$.length = 0;
                        let $match = this.contacts$.filter(($contact: any) => $contact.nickname.toUpperCase().indexOf(val.toUpperCase()) > -1);
                        this.searchList$ = $match;

            }




            personTYping ($request) {

                        try {   
                                
                                this.fbDb.object(`/Typing/${$request.id}/`)
                                         .query
                                         .on('child_added', ($d) => {
                                                        
                                                        if ($d.key !== this.$userid) {

                                                                this.personIsTyping = true;
                                                                this.chatviewComponent.scrolltoBottom();
                                                                this.set$contact$typing($d.key);

                                                        }
                                                        

                                                })

                                this.fbDb.object(`/Typing/${$request.id}/`)
                                         .query
                                         .on('child_removed', ($d) => {

                                                if ($d.key && $d.key === this.$userid) {

                                                        this.personIsTyping = false;
                                                        this.rem$contact$typing($d.key);

                                                } else  {

                                                        this.personIsTyping = false;
                                                        this.rem$contact$typing($d.key);
                                                }

                                        });


                        } catch (err) {

                                
                                
                        }
                                 
             }




             set$contact$typing ($key) {

                        this.contacts$.filter(($cont: any) => {

                                if ($cont.key === $key) {

                                        $cont.isTyping = true;

                                }

                        })

             }



             rem$contact$typing ($key) {

                        this.contacts$.filter(($cont: any) => {

                                if ($cont.key === $key) {

                                        $cont.isTyping = false;

                                }

                        })

             }




             getnewMessages ($friend) {

                        let path: string;

                        if ($friend.isSender) {

                                path = `/Relations/${this.$userid}/${$friend.key}/messages/${this.$userid}/count`

                        } else  {

                                path = `/Relations/${$friend.key}/${this.$userid}/messages/${this.$userid}/count`;

                        }
                                                
                        this.messageSubscription = this.fbDb.object(path)
                                                            .valueChanges()
                                                            .subscribe($d => {

                                                                        $friend.messages = $d;
                                                                        this.contacts$.filter(($cont: any) => {

                                                                                if ($cont.key === $friend.key) {

                                                                                        $cont.messages = $d;
                                                                                }

                                                                        });

                                                             });

                }



             



             ngOnDestroy () {

                        try {

                                this.fbDb.list(`/Chats/${this.$request.id}/messages`).query.off('child_added');
                                this.fbDb.object(`/Typing/${this.$request.id}/`).query.off('child_added');
                                this.fbDb.object(`/Typing/${this.$request.id}/`).query.off('child_removed');
                                this.messageSubscription.unsubscribe();
                                this.oncallSubscription.unsubscribe();

                        } catch (error) {
                                
                                
                                
                        }
             }



}
