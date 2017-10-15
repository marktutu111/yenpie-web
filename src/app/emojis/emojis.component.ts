import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Emojis } from "./emoji.service";
import { AngularFireDatabase } from "angularfire2/database";


@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.css'],
  providers: [Emojis]
})




export class EmojisComponent implements OnInit {


            emojis$: Array<any>[] = [];
            @Output () sendemoji: EventEmitter<any> = new EventEmitter();


            constructor (private emoji$vice: Emojis, private fbDb: AngularFireDatabase) {}

            
            ngOnInit () {

                  setTimeout(() => {

                      this.emoji$vice.get();
                      this.emojis$ = this.emoji$vice.emojis$;

                  }, 200)

            }



            sendEmoji ($el) {

                      this.sendemoji.emit($el);

            }



}
