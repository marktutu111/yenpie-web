import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, Output } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { AngularFireDatabase } from "angularfire2/database";
import { FriendsService } from "../services/friends.service";
import { PushService } from "../services/push.service";
import * as firebase from "firebase";



interface Request {
      nickname: string;
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
  selector: 'app-chatview',
  templateUrl: './chatview.component.html',
  styleUrls: ['./chatview.component.css', '../chat/chat.component.css']
})





export class ChatviewComponent implements OnInit {


              @Input () personActive: boolean;
              @Input () $userid: string;
              @Input () $request: Request;

              @Input () chats$: Array<any>[] = [];
              message: string = "";
              startedTyping: boolean = false;
              @Input () personIsTyping: boolean = false;
              @ViewChild ('chatview') chatview: ElementRef;
              


              constructor (private sanitizer: DomSanitizer,
                           private push$vice: PushService,     
                           private fbDb: AngularFireDatabase, private friend$vice: FriendsService) {}



              ngOnInit () {}




              send ()  {


                  if (this.message === "") return;

                  let $sendData = {
                          message: this.message,
                          date: Date(),
                          _id: String(Math.floor(Math.random() * 99999)),
                          messageBy: this.$userid,
                          type: 'text',
                          requestId: this.$request.id
                  }


                  this.message = "";
                  this.sendchat($sendData);

              
                  if (!this.personActive) {

                          if (this.$request.isSender) {
                                  
                                  this.fbDb.object(`/Relations/${this.$userid}/messages/${this.$request.key}/`)
                                           .query
                                           .once('value', (res) => {

                                                try {

                                                      if (res.val()) {

                                                            for (var key in res.val()) {

                                                                    let count = res.val()[key];
                                                                    this.fbDb.object(`/Relations/${this.$userid}/messages/${this.$request.key}/`)
                                                                            .update({ count: count++ || 1 })
                                                            }

                                                      }   else  {

                                                            this.fbDb.object(`/Relations/${this.$userid}/messages/${this.$request.key}/`)
                                                                    .update({ count: 1 })

                                                      }
                                                  
                                                } catch (error) {

                                                      // ..

                                                }

                                           });

                          } else {

                                  this.fbDb.object(`/Relations/${this.$request.key}/messages/${this.$request.key}`)
                                           .query
                                           .once('value', (res) => {

                                                    try {

                                                          if (res.val()) {

                                                                for (var key in res.val()) {

                                                                        let count = res.val()[key];
                                                                        this.fbDb.object(`/Relations/${this.$request.key}/messages/${this.$request.key}`)
                                                                                 .update({ count: count++ || 1 })
                                                                }

                                                          }   else  {

                                                                this.fbDb.object(`/Relations/${this.$request.key}/messages/${this.$request.key}`)
                                                                         .update({ count: 1 })

                                                          }
                                                      
                                                    } catch (error) {

                                                          // ..

                                                    }

                                           });

                          }
                          
                  }


            }



            


            sendchat ($sendData) {

                  this.fbDb.list(`/Chats/${this.$request.id}/messages`)
                           .push($sendData)
                           .then($res => {

                                 this.sendPush($sendData);

                           }, err => {

                                  // ..Error.. //

                           });

            }



            fileChangeEvent (fileInput: any) {

                    if (fileInput.target.files && fileInput.target.files[0]) {

                              let reader = new FileReader();
                              reader.onload = (e: any) => {

                                      let $photo = e.target.result;
                                      let $photoString = $photo.split(',')[1];
                                      let $sendData = {
                                              photo: $photoString,
                                              date: Date(),
                                              _id: String(Math.floor(Math.random() * 99999)),
                                              messageBy: this.$userid,
                                              type: 'image'
                                      }


                                      this.sendchat($sendData);

                              }

                              reader.readAsDataURL(fileInput.target.files[0]);
                    }

            }




            scrolltoBottom () {
                    
                    try {
                            setTimeout(() => {

                                    this.chatview.nativeElement.scrollTop  = this.chatview.nativeElement.scrollHeight;

                            }, 200);

                    } catch (err) {

                            console.log(err);
                            
                    }
             }





             typing ($e) {
                        
                        if (this.startedTyping) return;
                        let $typing = setTimeout( () => {

                                this.fbDb.object(`/Typing/${this.$request.id}/${this.$userid}`)
                                         .set(true)
                                         .then(() => {

                                                setTimeout(() => {

                                                        this.fbDb.object(`/Typing/${this.$request.id}/${this.$userid}`)
                                                                 .remove()
                                                                 .then(() => {

                                                                        this.startedTyping = false;

                                                                 })

                                                }, 1000);

                                                firebase.database().ref(`/Typing/${this.$request.id}/${this.$userid}`).onDisconnect().remove();
                                                 
                                         })

                        }, 500);

                        this.startedTyping = true;

             }




             sendPush ($sendData) {


                        let pushData = {
                                notification: {
                                        body: 'I sent you a message',
                                        title: this.$request.nickname,
                                        sound: 'default'
                                },
                                data: {
                                        type: 'chat',
                                        key: this.$request.key    
                                },
                                content_available: true,
                                priority: "high",
                                to: this.$request.pushToken
                        }


                        this.push$vice.send(pushData);


             }
                


             sendEmo ($el) {

                        let $sendData = {
                                date: Date(),
                                _id: String(Math.floor(Math.random() * 99999)),
                                messageBy: this.$userid,
                                type: 'emoji',
                                image: $el,
                                requestId: this.$request.id
                        }

                        this.sendchat($sendData);

             }


             onKeydown (event: any) {

                     if (event.keyCode === 13) this.send();

             }


             

            
            


}
