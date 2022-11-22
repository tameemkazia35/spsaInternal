import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  allevents: any = [];
  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.service.get(apis.allEvents, '').subscribe(_res=>{
      this.allevents = _res;
    })
  }

  removeEvent(_eventId: any){

  }

  toggleEventStatus(_eventId: any, _event: any){

  }

}
