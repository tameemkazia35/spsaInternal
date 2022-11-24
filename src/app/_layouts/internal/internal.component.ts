import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/_services/util.service';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { apis } from 'src/app/_enum/apiEnum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss']
})
export class InternalComponent implements OnInit {
  userData: any = {};
  items!: MenuItem[];
  langItems!: MenuItem[];
  menuList: any;
  currentLang: any;
  languages: any;
  constructor(private router: Router, private util: UtilService, private service: ApiService, private translateService: TranslateService) { 
    this.getLangs();
  }

  ngOnInit(): void {
    this.currentLang = this.util.getCurrentLang();
    console.log('this.currentLang', this.currentLang);
    this.afterLoginMenu();
    this.util.observlogin().subscribe((_res :any)=>{
     this.afterLoginMenu();
    })
    var Html = document.querySelector('html') as HTMLElement;
    this.util.observLang().subscribe(_res=>{
      console.log('_res', _res);
      if(_res == 'en'){
        Html.setAttribute('dir', 'ltr');
        Html.setAttribute('lang', 'en');
        return;
      }

      if(_res == 'ar'){
        Html.setAttribute('dir', 'rtl');
        Html.setAttribute('lang', 'ar');
        return;
      }
    })
    this.getMenus();
  }

  getMenus(){
    this.service.get(apis.menus, '').subscribe(_res => {
      this.menuList = _res[0].menuItems;
    })
  }

  afterLoginMenu(){
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(this.userData.token){
     this.items = [
        {
          label: this.userData.username,
          disabled: true,
          styleClass: 'username'
         },
          {label:'Settings',
             icon:'pi pi-fw pi-chart-pie',
             command:e => this.goToAdmin(e)
         },
         {
          label:'Logout',
          icon:'pi pi-fw pi-lock',
          command:e => this.logout(e)
      }
     ]
    }
  }

  goToAdmin(_ev: Event){
    if(this.userData.role.toLowerCase() == 'admin'){
      this.router.navigate(['/admin/menu']);
    }
    else if(this.userData.role.toLowerCase() == 'event'){
      this.router.navigate(['/admin/events']);
    }
    else if(this.userData.role.toLowerCase() == 'news'){
      this.router.navigate(['/admin/announcements']);
    }
    else if(this.userData.role.toLowerCase() == 'user'){
      this.router.navigate(['/admin/quick-links']);
    }
  }

  logout(_ev: Event){
    localStorage.removeItem('currentUser');
    this.util.publishlogout(true);
    this.router.navigate(['/']);
  }

  getLangs(){
    this.service.get(apis.languages, '').subscribe(_res=>{
      this.languages = _res;
    var labels: any = [];
      this.languages.forEach((_lang: { name: any; code: any; }) => {
          labels.push({label: _lang.name, command:(Event: Event) => this.setLang(_lang.code)});
      });
      this.langItems = labels;
    })
  }

  setLang(_ev: string){
    this.util.setLang(_ev);
    this.currentLang = _ev;
    localStorage.setItem('lang', _ev);
    this.translateService.setDefaultLang(_ev);
    console.log('lang', _ev);
  }

  
}
