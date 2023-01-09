import { AfterViewInit, Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  services: any = [];
  departments: any = [];
  services2: any = [];
  currentLang: any;
  public selectedEvent: any;
  mediaPath = environment.mediaPath;
  calendarOptions: CalendarOptions = {};
  eventList: any;
  newsList: any;
  display: boolean = false;
  dialogType: string = '';
  userData: any;
  constructor( private service: ApiService, private util: UtilService, private router: Router) { 
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap5',
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      eventClick: function(_event){
        util.publishEvent(_event.event);
      },
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
      }
    };
  }

  ngAfterViewInit(): void {
    var ele1 = document.getElementsByClassName('anouncement-list')[0] as HTMLElement;
    ele1.style.height = document.getElementsByTagName('full-calendar')[0].clientHeight+'px'; 
  }

  ngOnInit(): void {
    this.currentLang = this.util.getCurrentLang();
    this.calendarOptions.locale = this.currentLang;
    this.util.observLang().subscribe(_res=>{
      this.currentLang = _res;
      this.calendarOptions.locale = _res;
    });
    console.log('this.currentLang', this.currentLang);
    if(this.userData.token){
      this.afterLogin();
    }

    this.util.observlogin().subscribe((_res :any)=>{
      this.afterLogin();
    })

    this.util.observEvent().subscribe(_res=>{
      var event = this.eventList.filter((_event: any)=> _event.id == _res.id)[0];
        this.openEvent(event);
    })
  }

  afterLogin(){
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.getPageBySlug();
    this.getAllevents();
    this.getAllAnouncements();
  }



  getPageBySlug(){
    this.services = [];
    this.service.get(apis.pageByUrl, '/').subscribe(_res=>{
      var parseData = JSON.parse(_res.page.pageComponents.data);
      this.services =  parseData.schema.links;

      // Filter by Tag
      if(this.userData['role'] !== 'Admin') {
        this.services = this.services.filter( (ser: any) =>  this.userData['path'].includes(ser.adTag) );
      }
      
      this.services2 = _res.quickLinks;
    });
  }

  getAllAnouncements(){
    this.service.get(apis.news, '').subscribe(_res=>{
      this.newsList = _res;
      this.newsList = this.newsList;
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
    if(news){
      news.hide = true;
    }
    
  }

  openEvent(_event: any){
    this.dialogType = 'event';
    this.selectedEvent = _event;
    console.log(this.selectedEvent);
    var _formatedStartDate = moment(this.selectedEvent.startDateTime).format('DD MMM YYYY');
    var _formatedEndDate = moment(this.selectedEvent.endDateTime).format('DD MMM YYYY');
    var _startTime = moment(this.selectedEvent.startDateTime).format('hh:mm a');
    var _endTime = moment(this.selectedEvent.endDateTime).format('hh:mm a');
    debugger;
    if(moment(this.selectedEvent.endDateTime).diff(moment(this.selectedEvent.startDateTime), 'days') > 0)
        {
          this.selectedEvent.eventdatetime = _formatedStartDate + ' ' + _startTime + ' - ' + _formatedEndDate + ' ' + _endTime;
        }
        if(moment(this.selectedEvent.endDateTime).diff(moment(this.selectedEvent.startDateTime), 'days') == 0){
          this.selectedEvent.eventdatetime = _formatedStartDate + '  | ' + _startTime + ' - ' + _endTime;
        }
        this.display = true;
  }

  openNews(_news: any){
    this.dialogType = 'news';
    this.selectedEvent = _news;
    this.display = true;
  }

  goToPage(_page: any, type: any){
    if(type == '1'){
    if(_page.target == "_self"){
      this.router.navigate([_page.url])
    }else{
      window.open(_page.url, '_blank');
    }
  }

  if(type == '2'){
    if(_page.target == "_self"){
      this.router.navigate([_page.slug])
    }else{
      window.open(_page.slug, '_blank');
    }
  }

  }

  openmedia(_media: any){
    window.open(this.mediaPath + _media.url, '_blank');
  }

}
