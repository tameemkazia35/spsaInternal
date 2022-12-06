import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userData: any = {};
  items!: MenuItem[];
  constructor(private router: Router, private util: UtilService) { 
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this.userData.username,
        items:[
            {
                label:'Home',
                icon:'pi pi-fw pi-home',
                command:e => this.goToHome(e)

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

  goToHome(_ev: Event){
    this.router.navigate(['/']);
  }

  logout(_ev: Event){
    localStorage.removeItem('currentUser');
    this.util.publishlogout(true);
    this.router.navigate(['/']);
  }

}
