import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";




@Injectable ()
export class Memories {


            memories: Array<any>[] = [];
            $userid: string;


            constructor (private fbDb: AngularFireDatabase, private sanitizer: DomSanitizer) {};




            loadMemories () {


                    this.fbDb.list(`/Memories/`)
                        .query
                        .limitToLast(50)
                        .once('value', $mems => {

                                if ($mems.val()) {

                                        for (var key in $mems.val()) {

                                                var $mem = $mems.val()[key].mood
                                                $mem.photos = $mems.val()[key].photos;
                                                $mem.date = moment(new Date($mem.date)).fromNow();
                                                $mem.key = key;
                                                $mem.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $mem.photo);
                                            
                                                this.appendMems($mem);

                                        }
                                        
                                        
                                }

                        });

            }



            appendMems ($mem) {

                    let $match = this.memories.filter((memory: any) => $mem.key === memory.key);                
                    if (!$match[0]) this.memories.push($mem);                 

            }



}