import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CallService } from "../services/webrtc.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";




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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../chat/chat.component.css']
})







export class ProfileComponent implements OnInit {


                @Input () $request: Request;
                @Input () personActive: boolean;

                connection: string = "";
                calling: boolean = false;
                call$: Subscription;

                constructor (private call$vice: CallService, private router: Router) {}
                

                ngOnInit () {}




                call () {

                        this.calling = true;
                        this.connection = 'Connecting..';
                        setTimeout(() => {

                                this.connection = 'User Buzy';
                                this.calling = false;

                        }, 1000 * 3);
                        
                        // this.call$vice.checkStatus(this.$request).subscribe($conn => {

                        //             if ($conn && $conn === 'busy') {

                        //                     this.connection = 'User Busy';
                        //                     return this.calling = false;

                        //             }

                        //             this.sendCall();

                        // })

                }



                sendCall () {

                        this.call$vice.call(this.$request);
                        this.call$vice.ongoingCall(this.$request.key);
                        this.connection = 'Calling..';
                        this.call$ = this.call$vice.call$.subscribe($conn => {

                                switch ($conn) {
                                      case 'answered':
                                          this.connection = 'Connected';
                                          this.router.navigate(['home', {'outlets': {'0' : ['call']} }]);
                                      case 'rejected':
                                          this.connection = 'Call Rejected';
                                          this.call$.unsubscribe();
                                      case 'disconnected':
                                          this.connection = 'Disconnected';
                                          this.call$.unsubscribe();
                                      default:
                                        break;
                                }

                        });

                }



                
                endCall () {



                }






}
