import { Http, RequestOptions, Headers } from "@angular/Http";
import { Injectable } from "@angular/core";



@Injectable ()
export class PushService {


        constructor (private http: Http) {};


        send (body: any) {

                let url: string = "https://fcm.googleapis.com/fcm/send";
                let headers = new Headers({
                                    'Authorization': 'key=AIzaSyAJDTl6ck5mv5Y_EDEtSUV9BreTNbTVQkM',
                                    'Content-Type': 'application/json'
                                  })

                let options = new RequestOptions({ headers: headers });
                return this.http.post(url, body, options)
                                .map($d => $d)
                                .catch(err => err)

        }

}