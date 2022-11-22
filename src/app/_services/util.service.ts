import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private loginSubject = new Subject<any>();

  constructor() { }

  publishlogin(data: any) {
    this.loginSubject.next(data);
  }

  observlogin(): Subject<any> {
    return this.loginSubject;
  }


}
