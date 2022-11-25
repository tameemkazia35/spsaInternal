import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  allevents: any = [];
  searchText: any = '';
  
  constructor(private service: ApiService, private confirmationService: ConfirmationService, private router: Router, private messageService: MessageService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.service.get(apis.allEvents, '').subscribe(_res=>{
      this.allevents = _res;
      this.allevents.forEach((_event: any) => {
        if(_event.startDateTime == null || _event.endDateTime == null){
          return;
        }
        var _formatedStartDate = moment(_event.startDateTime).format('DD MMM YYYY');
        var _formatedEndDate = moment(_event.endDateTime).format('DD MMM YYYY');
        var _startTime = moment(_event.startDateTime).format('hh:mm a');
        var _endTime = moment(_event.endDateTime).format('hh:mm a');

        if(moment(_event.endDateTime).diff(moment(_event.startDateTime), 'days') > 0)
        {
          _event.eventdatetime = _formatedStartDate + ' ' + _startTime + ' - ' + _formatedEndDate + ' ' + _endTime;
        }
        if(moment(_event.endDateTime).diff(moment(_event.startDateTime), 'days') == 0){
          _event.eventdatetime = _formatedStartDate + '  | ' + _startTime + ' - ' + _endTime;
        }
      });
    })
  }

  removeEvent(_eventId: any){
    this.spinner.show();
    this.service.delete(apis.deletePage, _eventId, '').subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Event successfully deleted.', 'success');
      this.getEvents();
    }, error=>{
      this.spinner.hide();
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
    })
  }

  editEvent(_eventId: any){
    this.router.navigate(['/admin/event'], {queryParams: {type:'edit', id: _eventId}});
  }

  toggleEventStatus(_eventId: any, _event: any){

  }

  confirm(_id: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this event?',
        accept: () => {
            this.removeEvent(_id);
        }
    });
}

toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
  this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
  }

}
