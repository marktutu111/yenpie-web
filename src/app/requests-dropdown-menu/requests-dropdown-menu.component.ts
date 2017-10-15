import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { PushService } from "../services/push.service";



@Component({
  selector: 'app-requests-dropdown-menu',
  templateUrl: './requests-dropdown-menu.component.html',
  styleUrls: ['./requests-dropdown-menu.component.css', '../home/home.component.css']
})





export class RequestsDropdownMenuComponent implements OnInit {


              @Input () $requests: Array<any>[] = [];
              @Input () $userid: string;



              constructor (private fbDb: AngularFireDatabase, private push$vice: PushService) {};



              ngOnInit () {}



              accept ($i) {

                    let $match = this.$requests.filter(($res: any, $index: number) => {
                              if ($index === $i) {

                                    $res.accept = true;
                                    return $res;

                              }
                    });

                    if ($match[0]) {
                          let $req: any = $match[0];
                          this.fbDb.object(`/Relations/${this.$userid}/`)
                                  .set({ date: Date(), sender: $req.key, id: this.randn() })
                                  .then(() => {

                                        this.fbDb.object(`/Profiles/${this.$userid}/requests/${$req.key}`)
                                                 .remove();       
                                        this.$requests.filter(($res: any, $index: number) => {
                                                  if ($index === $i) $res.accepted = true;
                                        });


                                        // SEND PUSH MESSAGE
                                        let pushData = {
                                                notification: {
                                                        body: 'I accepted your request',
                                                        title: $req.nickname,
                                                        sound: 'default'
                                                },
                                                data: {
                                                        type: 'request'    
                                                },
                                                content_available: true,
                                                priority: "high",
                                                to: $req.pushToken
                                        }


                                        this.push$vice.send(pushData);

                                        // Remove from list.
                                        this.$requests.splice($i,1);


                                  }, err => {

                                      this.$requests.filter(($res: any, $index: number) => {
                                                  if ($index === $i) return $res.accept = false;
                                        });

                                  })

                    }

              }




              reject ($i) {

                      let $match = this.$requests.filter(($res: any, $index: number) => {
                              if ($index === $i) {

                                    $res.reject = true;
                                    return $res;

                              }
                    });

                    if ($match[0]) {
                          let $req: any = $match[0];
                          this.fbDb.object(`/Profiles/${this.$userid}/requests/${$req.key}`)
                                  .remove()
                                  .then(() => {

                                        this.$requests.filter(($res: any, $index: number) => {
                                                  if ($index === $i) $res.rejected = true;
                                        });


                                        // Remove from list.
                                        this.$requests.splice($i, 1);

                                  }, err => {

                                      this.$requests.filter(($res: any, $index: number) => {
                                                  if ($index === $i) return $res.reject = false;
                                        });

                                  })

                    }

              }



              
              randn () {

                      return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);

              }


}
