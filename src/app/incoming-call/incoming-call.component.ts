import { Component, OnInit } from '@angular/core';
import { CallService } from "../services/webrtc.service";
import { FriendsService } from "../services/friends.service";
import { Router } from "@angular/router";



@Component({
    selector: 'app-incoming-call',
    templateUrl: './incoming-call.component.html',
    styleUrls: ['./incoming-call.component.css', '../home/home.component.css']
})




export class IncomingCallComponent implements OnInit {

              incoming: any;


              
              constructor (private call$vice: CallService, 
                           private friends$vice: FriendsService,
                           private router: Router) {}




              ngOnInit () {

                    //  this.call$vice.getIncomingCall()
                    //                .subscribe($d => {

                    //                     this.friends$vice.loadfriendProfile($d, ($request) => {
                                          
                    //                               this.incoming = $request
                    //                               this.call$vice.onIncomingDisconnect($request.key);
                                            
                    //                         })
                                      
                    //                   });


                    //   this.call$vice.call$.subscribe($res => {

                    //             switch ($res) {
                    //                   case 'canceled':
                    //                       this.incoming = undefined;
                    //                       break;
                    //                   case 'connected':
                    //                       this.router.navigate(['home', {'outlets' : { '0' : ['chats']} }]);
                    //                       this.incoming = undefined;
                    //                       break;
                    //                   case 'disconnected':
                    //                       this.incoming = undefined;
                    //                       break;
                    //                   default:
                    //                     break;
                    //             }

                    //   });

              }



              answerCall () { this.call$vice.answer(this.incoming); }

              rejectCall () { 
                
                    this.call$vice.rejectCall(this.incoming);

              }


}
