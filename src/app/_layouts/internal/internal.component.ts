import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/_services/util.service';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { apis } from 'src/app/_enum/apiEnum';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  prayerModal: boolean = false;
  prayerTheme: any = {primary: '851825', secondary:'357342', menuText: 'ffffff'};
  iframURl: any;

  constructor(private router: Router, private util: UtilService, private service: ApiService, private translateService: TranslateService, private sanitize: DomSanitizer) { 
    this.getLangs();
  }

  ngOnInit(): void {
    this.util.observTheme().subscribe(_res=>{
      this.prayerTheme = JSON.parse(JSON.stringify(_res));
      this.prayerTheme.primary = this.prayerTheme.primary.replace('#', '');
      this.prayerTheme.secondary= this.prayerTheme.secondary.replace('#', '');
      this.prayerTheme.menuText = this.prayerTheme.menuText.replace('#', '');
      this.iframURl = this.sanitize.bypassSecurityTrustResourceUrl('https://timesprayer.com/widgets.php?frame=2&lang=en&name=sharijah&avachang=true&time=0&fcolor='+this.prayerTheme.secondary+'&tcolor='+this.prayerTheme.menuText+'&frcolor='+this.prayerTheme.secondary);
    });
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
          
          items:[
              {
                  label:'Settings',
                  icon:'pi pi-fw pi-chart-pie',
                  command:e => this.goToAdmin(e)
  
              },
              {
                  label:'Logout',
                  icon:'pi pi-fw pi-lock',
                  command:e => this.logout(e)
              }
          ]
      },
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
    // Color changing code
    /*
    var rootSudoElement: any = document.querySelector(':root');
    var rs : any = getComputedStyle(rootSudoElement);
    console.log("Before The value of --bs-p is: " + rs.getPropertyValue('--bs-p'));
    rootSudoElement.style.setProperty('--bs-p', 'green');
    console.log("After the value of --bs-p is: " + rs.getPropertyValue('--bs-p'));
    */
  }


  goToPage(_page: any){
    if(_page.target == "_self"){
      this.router.navigate([_page.slug])
    }else{
      window.open(_page.slug, '_blank');
    }
  }
  
}
