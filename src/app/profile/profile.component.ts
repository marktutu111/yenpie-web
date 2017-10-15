import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CallService } from "../services/webrtc.service";



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

                constructor (private call$vice: CallService) {}
                

                ngOnInit () {}



                call () {

                        try {

                            this.call$vice.room$id = this.$request.id;
                            this.call$vice.start$vice();
                            this.call$vice.onConn$().subscribe($d => {

                                      this.call$vice.join$room();

                            })

                        } catch (error) {
                          
                        }

                }






}
