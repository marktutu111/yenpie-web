import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";


declare const SimpleWebRTC: any;



@Injectable ()
export class CallService {


        video: boolean = false;
        audio: boolean = false;
        webrtc: any;
        $userid: string;

        peer$ = new Subject();
        call$ = new Subject();
        room$id: string;



        constructor (private fbDb: AngularFireDatabase) {};


        start$vice () {
                
                let self = this;
                this.webrtc = new SimpleWebRTC({
                        // the id/element dom element that will hold "our" video
                        localVideoEl: 'yp-vid-1',
                        // the id/element dom element that will hold remote videos
                        remoteVideosEl: 'yp-vid-0',
                        // immediately ask for camera access
                        autoRequestMedia: true
                });


                // we have to wait until it's ready
                this.webrtc.on('readyToCall', function () {
                        // you can name it anything
                        self.peer$.next('open');
                });

        }



        join$room (room?: string) {

                this.webrtc.joinRoom(room || this.$userid);

        }




        onConn$ (): Observable<any> {

                return this.peer$.asObservable();

        }




        call (request: any) {

                this.fbDb.object(`/Profiles/${this.$userid}/call/${request.key}`)
                                 .set({ date: Date(), active: false })
                                 .then(() => {

                                        firebase.database().ref(`/Profiles/${this.$userid}/call/${request.key}`)
                                                           .onDisconnect()
                                                           .remove()
                                                           .then(() => {

                                                                        this.fbDb.object(`/Chats/${request.id}/messages`)
                                                                                 .query
                                                                                 .once('value', $d => {
                                                                                         
                                                                                        if ($d.val()) {

                                                                                                for (var key in $d.val()) {
                                                                                                        
                                                                                                        if (!$d.val()[key].active) {

                                                                                                                this.fbDb.list(`/Chats/${request.id}/messages`)
                                                                                                                        .push({
                                                                                                                                type: 'missed-call',
                                                                                                                                date: Date(),
                                                                                                                                messageBy: this.$userid,
                                                                                                                                requestId: request.id,
                                                                                                                                _id: String(Math.floor(Math.random() * 99999))
                                                                                                                        })

                                                                                                        }
                                                                                                }

                                                                                        }
                                                                                 });

                                                           });

                                this.call$.next('success');

                         }, err => {

                                this.call$.next('error');

                         })
                

        }


        // LISTEN FOR INCOMING CALL
        getIncomingCall (): Observable<any> {

                return Observable.create(observer => {

                        this.fbDb.object(`/Profiles/${this.$userid}/call/`)
                                 .query
                                 .on('child_added', ($d) => {

                                        if ($d.val()) {

                                                for (var key in $d.val()) {

                                                        let incoming = { key: key, value: $d.val() };
                                                        observer.next(incoming);
                                                        
                                                }

                                        }

                                 })
                })

        }




        // ANSWER INCOMING CALL
        answer (request: any) {

                this.webrtc.join$room(request.key);
                this.fbDb.object(`/Profiles/${this.$userid}/call/${request.key}`)
                         .update({ active: true })
                         .then(() => {

                                this.call$.next('connected');

                         })

        }





        // CHECK IF PERSON IS ON ANOTHER CALL
        checkStatus (request: any): Observable<any> {

                return Observable.create(observer => {
                        this.fbDb.object(`/Profiles/${this.$userid}/call/${request.key}`)
                                .query
                                .once('value', $d => {

                                        if ($d.val()) {

                                                observer.next($d.val().active);

                                        }  else {

                                                observer.next(null);
                                                
                                        }

                                });
                });

        }






}