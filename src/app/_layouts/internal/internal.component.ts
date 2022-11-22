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
  constructor(private router: Router) { 
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    this.items = [
      {
        label: this.userData.email,
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

            }
        ]
    },
    ]
  }

  goToAdmin(_ev: Event){
    this.router.navigate(['/admin/menu']);
  }
}
