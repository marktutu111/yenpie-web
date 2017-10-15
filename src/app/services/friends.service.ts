import { Subject } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



interface Friend {
        key?: string;
        photo?: any;
        nickname?: string;
        lastSeen?: string;
        messages?: number;
        isNew?: boolean;
        profession?: string;
        id?: string;
        isSender?: boolean;
        pushToken?: string;
}



@Injectable ()

export class FriendsService {


        friends$: Array<Friend>[] = [];
        $userid: string;
        loadingchats$ = new Subject<any>();


        constructor (private fbDb: AngularFireDatabase, private sanitizer: DomSanitizer) {}


        

        getFriend ($key): Promise<any> {
                return new Promise((resolve,reject) => {
                        let $match = this.friends$.filter(($friend: any) => $friend.key === $key);
                             resolve($match[0]);   
                })
        }



        loadFriends (callback) {

                this.fbDb.list("/Relations/")
                        .query
                        .once('value', (result) => {
                                
                                if (result.val()) {

                                        for (var key in result.val()) {

                                                var $friends = result.val()[key];
                                                        $friends.key = key;
                                                
                                                        if ($friends.key === this.$userid || $friends.sender === this.$userid) {

                                                                var $friend: Friend = { key: '', id:  $friends.id }

                                                                if ($friends.key === this.$userid) {

                                                                        $friend.key = $friends.sender;
                                                                        $friend.isSender = true;

                                                                        } else {

                                                                        $friend.key = $friends.key;
                                                                        $friend.isSender = false;
                                                                                
                                                                }
                                                                        

                                                                if ($friends.messages) {

                                                                        for (var key in $friends.messages) {

                                                                                if (key === this.$userid) {

                                                                                        var $messages = $friends.messages[key];
                                                                                            $friend.messages = $messages.count;

                                                                                } else {

                                                                                        $friend.messages = 0;
                                                                                }
                                                                                
                                                                        }

                                                                } else  {

                                                                        $friend.messages = 0;
                                                                }

                
                                                                callback($friend);

                                                        }


                                        }
                                }

                        });
        }




        loadfriendProfile ($friend, callback) {

                        this.fbDb.object(`/Profiles/${$friend.key}/`)
                                 .query
                                 .once('value', (result) => {
                                                
                                            if (result.val()) {
                                                        
                                                    var $profile = result.val();
                                                    $profile.photo ? $friend.photo = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + $profile.photo) : $friend.photo = "";
                                                    $profile.nickname ? $friend.nickname = $profile.nickname : $friend.nickname = "";
                                                    $profile.age ? $friend.age = $profile.age : $friend.age = "";
                                                    $profile.profession ? $friend.profession = $profile.profession : $friend.profession = "";
                                                    $profile.pushToken ? $friend.pushToken = $profile.pushToken : $friend.pushToken = "";

                                                    if ($profile.online) {

                                                            var online = moment(new Date($profile.online.date)).fromNow();
                                                                $friend.lastSeen = online; 

                                                    } else  {

                                                            $friend.lastSeen = "Unknown";

                                                    }
                                                    
                                                    callback($friend);
                                                    

                                            }
                                 })
        }




        loadChat ($request, callback) {

                this.fbDb.list(`/Chats/${$request.id}/messages`)
                        .query
                        .limitToLast(1)
                        .once('value', ($d) => {

                        if ($d.val()) {

                                let $messages = $d.val();
                                for (var key in $messages) {

                                        if ($messages[key].message) {

                                                if ($messages[key].message.length > 20) {

                                                        $request.lastMessage = $messages[key].message.substring(0, 20) + '..';

                                                }  else  {

                                                        $request.lastMessage = $messages[key].message;
                                                        
                                                }
                                        }

                                        if ($messages[key].date) $request.message$date = moment(new Date($messages[key].date)).format('LT');
                                }

                        } else  {

                                $request.lastMessage = "";

                        }

                });


                this.appendFrnds($request);
                callback($request);


        }






        appendFrnds ($friend) {

                    let $match = this.friends$.filter(($frnd: any) => $frnd.key === $friend.key);                
                    if (!$match[0]) this.friends$.push($friend);                 

        }




        onChatsLoaded (): Observable<any> {

                return this.loadingchats$.asObservable();

        }





}