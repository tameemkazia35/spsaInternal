import { AfterViewInit, Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  services: any = [];
  services2: any = [];
  currentLang: any;
  public selectedEvent: any;
  mediaPath = environment.mediaPath;
  calendarOptions: CalendarOptions = {};
  eventList: any;
  newsList: any;
  display: boolean = false;
  

  constructor( private service: ApiService, private util: UtilService) { 
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap5',
      eventClick: function(_event){
        util.publishEvent(_event.event);
      },
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      }
    };
    this.services = [
      {id: 1, icon: "work", name: 'Executive Office', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 2, icon: "account_balance", name: 'Institutional Excellence Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 3, icon: "apartment", name: 'Standard & Confirmity Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 4, icon: "work", name: 'Support Service Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'}
    ];

    this.services2 = [
      {id: 1, icon: "military_tech", name:"Compitations"},
      {id: 2, icon: "badge", name:"Employee Directory"},
      {id: 3, icon: "feed", name:"Forms"},
      {id: 4, icon: "local_offer", name:"Offers"},
      {id: 5, icon: "gavel", name:"Laws & Regulation"},
      {id: 6, icon: "folder_shared", name:"Share Folder"}
    ];
  }
  ngAfterViewInit(): void {
    var ele1 = document.getElementsByClassName('anouncement-list')[0] as HTMLElement;
    ele1.style.height = document.getElementsByTagName('full-calendar')[0].clientHeight+'px'; 
    
  }

  ngOnInit(): void {
    this.currentLang = this.util.getCurrentLang();
    // this.util.observLang().subscribe(_res=>{
    //   this.currentLang = _res;
    // });
    console.log('this.currentLang', this.currentLang);
    this.afterLogin();
    this.util.observlogin().subscribe((_res :any)=>{
     this.afterLogin();
    })

    this.util.observEvent().subscribe(_res=>{
        this.openEvent(_res);
    })
    
  }

  afterLogin(){
    this.getPageBySlug();
    this.getAllevents();
    this.getAllAnouncements();
  }

  getPageBySlug(){
    this.service.get(apis.pageByUrl, '/').subscribe(_res=>{
      var parseData = JSON.parse(_res.page.pageComponents.data);
      this.services = parseData.schema.links;
      this.services2 = _res.quickLinks;
      console.log(this.services);
    })
  }

  getAllAnouncements(){
    this.service.get(apis.news, '').subscribe(_res=>{
      this.newsList = _res;
      this.newsList = this.newsList.splice(0, 5);
    })
  }

  getAllevents(){
    this.service.get(apis.allEvents, '').subscribe(_res=>{
      this.eventList = _res;
      var events: any = [];
      this.eventList.forEach((_event: any) => {
        if(this.currentLang == 'ar'){
          events.push({id: _event.id, title: _event.title_ar, start: moment(_event.startDateTime).format('YYYY-MM-DDTHH:mm'), end: moment(_event.endDateTime).format('YYYY-MM-DDTHH:mm')} );
        }else{
          events.push({id: _event.id, title: _event.title, start: moment(_event.startDateTime).format('YYYY-MM-DDTHH:mm'), end: moment(_event.endDateTime).format('YYYY-MM-DDTHH:mm')});
        }
        console.log(events);
        this.calendarOptions.events = events;
      });
    })
  }

  errorImg(news: any){
    news.hide = true;
    console.log('img error');
  }

  openEvent(_event: any){
    this.selectedEvent = _event;
    console.log(this.selectedEvent);
    var _formatedStartDate = moment(this.selectedEvent.start).format('DD MMM YYYY');
    var _formatedEndDate = moment(this.selectedEvent.end).format('DD MMM YYYY');
    var _startTime = moment(this.selectedEvent.start).format('hh:mm a');
    var _endTime = moment(this.selectedEvent.end).format('hh:mm a');

    if(moment(this.selectedEvent.end).diff(moment(this.selectedEvent.start), 'days') > 0)
        {
          this.selectedEvent.eventdatetime = _formatedStartDate + ' ' + _startTime + ' - ' + _formatedEndDate + ' ' + _endTime;
        }
        if(moment(this.selectedEvent.end).diff(moment(this.selectedEvent.start), 'days') == 0){
          this.selectedEvent.eventdatetime = _formatedStartDate + '  | ' + _startTime + ' - ' + _endTime;
        }
        this.display = true;
  }

}
