import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private loginSubject = new Subject<any>();
  private logoutSubject = new Subject<any>();
  private langSubject = new Subject<any>();
  private eventSubject = new Subject<any>();

  constructor(private translate: TranslateService) { }

  publishlogin(data: any) {
    this.loginSubject.next(data);
  }

  observlogin(): Subject<any> {
    return this.loginSubject;
  }

  publishlogout(data: any) {
    this.logoutSubject.next(data);
  }

  observlogOut(): Subject<any> {
    return this.logoutSubject;
  }

  getCurrentLang(){
    return this.translate.currentLang ? this.translate.currentLang : this.translate.defaultLang;
  }

  setLang(data: string){
    this.langSubject.next(data);
  }

  observLang(): Subject<any> {
    return this.langSubject;
  }

  publishEvent(data: any) {
    this.eventSubject.next(data);
  }

  observEvent(): Subject<any> {
    return this.eventSubject;
  }


}
