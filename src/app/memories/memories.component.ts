import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { Memories } from "../services/memories.service";



@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})




export class MemoriesComponent implements OnInit {


  
                constructor (private fbAuth: AngularFireAuth, private mem$vice: Memories) {}


                ngOnInit () {

                        this.fbAuth.authState.subscribe($user => {

                              if ($user && $user.uid) this.mem$vice.$userid = $user.uid;

                        })

                }




}
