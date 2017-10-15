import { Component, OnInit } from '@angular/core';
import { Memories } from "../services/memories.service";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFireDatabase } from "angularfire2/database";



@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.css']
})





export class MemoryComponent implements OnInit {

              photos$: Array<any>[] = [];
              id: string;
              $userid: string;
              liked: boolean = false;
              likes: number = 0;


              constructor (private mem$service: Memories, private route: ActivatedRoute, 
                           private sanitizer: DomSanitizer,
                           private fbDb: AngularFireDatabase) {}



              ngOnInit () {

                      this.$userid = this.mem$service.$userid;
                      this.id = this.route.snapshot.params['id'];
                      let $match = this.mem$service.memories.filter(($mem: any) => $mem.key === this.id);
                      if ($match[0]) {

                              let $mems: any = $match[0];
                              for (var key in $mems.photos) {

                                    let $photo = 'data:image/jpg;base64,' + $mems.photos[key].photo;
                                    let d: any = { photo: $photo};
                                    this.photos$.push(d)
                              }

                      }


                      this.getlikes();

              }




              like () {
                    
                    this.liked = true;
                    this.fbDb.object(`/Memories/${this.id}/likes/${this.$userid}`)
                        .set(true)
                        .then(() => {

                              this.getlikes();

                        }, err => {

                            this.liked = false;

                        })

              }




              unlike () {

                    this.liked = false;
                    this.fbDb.object(`/Memories/${this.id}/likes/${this.$userid}`)
                        .remove()
                        .then(() => {

                              this.getlikes();

                        }, err => {

                            this.liked = true;

                        })

              }



              getlikes () {

                    this.fbDb.list(`/Memories/${this.id}/likes/`)
                             .query
                             .once('value', $likes => {

                                    let $count: Array<any> = [];
                                    for (var key in $likes.val()) {

                                          $count.push(key);
                                          if (key === this.$userid) this.liked = true;

                                    }

                                    this.likes = $count.length;

                             });
              }



}
