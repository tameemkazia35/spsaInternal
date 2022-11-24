import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { UtilService } from './_services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ 
    trigger('opacityScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('150ms ease-out', style({  opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(.95)' }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'spsaInternal';
  isMenuOpen = false;
  display = false;

  constructor(private util: UtilService,  private spinner: NgxSpinnerService, private router: Router) { 
    if(localStorage.getItem('currentUser')){
      this.display = false;
    }else{
      this.display = true;
      this.router.navigate(['/']);
    }
      this.util.observlogin().subscribe((_res :any)=>{
        console.log('login _res', _res);
        this.spinner.hide();
        this.display = false;
      })

      this.util.observlogOut().subscribe((_res: any)=>{
        this.display = true;
      })
  }
  
  
  toggleMenuOpen(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
