import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/_services/util.service';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss']
})
export class InternalComponent implements OnInit {
  userData: any = {};
  items!: MenuItem[];
  constructor(private router: Router, private util: UtilService) { 
    
  }

  ngOnInit(): void {
    this.util.observlogin().subscribe((_res :any)=>{
      this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if(this.userData.token){
       this.items = [
         {
           label: this.userData.username,
           icon:'pi pi-fw pi-user',
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
    })
   
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
}
