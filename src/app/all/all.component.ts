import { Component, OnInit } from '@angular/core';
import { Memories } from "../services/memories.service";




@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})





export class AllComponent implements OnInit {


              memories$: Array<any>[] = [];

              constructor (private mem$vice: Memories) {}


              ngOnInit () {

                    this.mem$vice.loadMemories();
                    this.memories$ = this.mem$vice.memories;

              }


}
