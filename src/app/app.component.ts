import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { UtilService } from './_services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('opacityScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(.95)' }))
      ])
    ])
  ]
})
export class AppComponent {
  
  isMenuOpen = false;
  display = false;

  constructor(private util: UtilService, private spinner: NgxSpinnerService, private router: Router, private translate: TranslateService, private Router: Router) {

    this.translate.addLangs(['en', 'ar']);

    this.router.events.subscribe((ev) => {
      var Html = document.querySelector('html') as HTMLElement;
      if (ev instanceof NavigationStart) {
        if (ev.url.includes('/admin')) {
          Html.setAttribute('dir', 'ltr');
          Html.setAttribute('lang', 'en');
        } else {
          var lang = localStorage.getItem('lang') || 'ar';
          this.translate.setDefaultLang(lang);

          if (lang == 'en') {
            Html.setAttribute('dir', 'ltr');
            Html.setAttribute('lang', 'en');
            return;
          }

          if (lang == 'ar') {
            Html.setAttribute('dir', 'rtl');
            Html.setAttribute('lang', 'ar');
            return;
          }
        }
      }
    })

    this.translate.onLangChange.subscribe((event: any) => {
      console.log('event.lang', event.lang);
    });

    // this.util.observLang().subscribe(_res=>{
    //   console.log('_res', _res);
    //   if(_res == 'en'){
    //     Html.setAttribute('dir', 'ltr');
    //     Html.setAttribute('lang', 'en');
    //     return;
    //   }

    //   if(_res == 'ar'){
    //     Html.setAttribute('dir', 'rtl');
    //     Html.setAttribute('lang', 'ar');
    //     return;
    //   }
    // })

    if (localStorage.getItem('currentUser')) {
      this.display = false;
    } else {
      this.display = true;
      this.router.navigate(['/']);
    }
    this.util.observlogin().subscribe((_res: any) => {
      console.log('login _res', _res);
      this.spinner.hide();
      this.display = false;
    })

    this.util.observlogOut().subscribe((_res: any) => {
      this.display = true;
    })
  }


  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
