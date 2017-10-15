import { Component, OnInit, Input } from '@angular/core';




@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css', '../moods/moods.component.css']
})






export class SearchViewComponent implements OnInit {

              @Input () searchList$: Array<any>[] = [];
              constructor () {}

              ngOnInit () {}

}
