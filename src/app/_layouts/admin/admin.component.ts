import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
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
                label:'Home',
                icon:'pi pi-fw pi-home',
                command:e => this.goToHome(e)

            },
            {
                label:'Logout',
                icon:'pi pi-fw pi-lock',

            }
        ]
    },
    ]
  }


  goToHome(_ev: Event){
    this.router.navigate(['/']);
  }

  logout(){
    
  }

}
