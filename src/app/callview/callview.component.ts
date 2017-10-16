import { Component, OnInit, OnDestroy } from '@angular/core';
import { CallService } from "../services/webrtc.service";
import { Subscription } from "rxjs";




@Component({
  selector: 'app-callview',
  templateUrl: './callview.component.html',
  styleUrls: ['./callview.component.css']
})




export class CallviewComponent implements OnInit {

          
          subcription: Subscription;
          minutes: number = 0;
          seconds: number = 0;
          hours: number = 0;

          connected: boolean = false;

          callduration: string = `${this.hours} : ${this.minutes} : ${this.seconds}`;

          $timer: any;


          constructor (private call$vice: CallService) {}


          ngOnInit () {
            
                this.subcription = this.call$vice.onConn$().subscribe(($conn: string) => {
                      if ($conn === 'connected') {

                              this.startTimer();

                      }

                });

          }




          startTimer () {

                  this.seconds++;

                  if (this.seconds === 60) {
                        this.minutes++;
                        this.seconds = 0;
                  }

                  if (this.minutes === 60) {
                        this.hours++;
                        this.minutes = 0;
                  }
                  
                  this.callduration = `${this.hours} : ${this.minutes} : ${this.seconds}`;
                  this.$timer = setTimeout(() => {

                      this.startTimer();

                  }, 1000);

          }




          ngOnDestroy () {

                try {

                    this.subcription.unsubscribe();
                    clearTimeout(this.$timer);
                    
                } catch (error) {
                  
                }

          }



}
