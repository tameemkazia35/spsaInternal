import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  services: any = [];
  services2: any = [];

  constructor() { 
    this.services = [
      {id: 1, icon: "work", name: 'Executive Office', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 2, icon: "account_balance", name: 'Institutional Excellence Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 3, icon: "apartment", name: 'Standard & Confirmity Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'},
      {id: 4, icon: "work", name: 'Support Service Dept', desc:'Lorem Ipsum is simply dummy text of the printing and typesetting industry'}
    ];

    this.services2 = [
      {id: 1, icon: "military_tech", name:"Compitations"},
      {id: 2, icon: "badge", name:"Employee Directory"},
      {id: 3, icon: "feed", name:"Forms"},
      {id: 4, icon: "local_offer", name:"Offers"},
      {id: 5, icon: "gavel", name:"Laws & Regulation"},
      {id: 6, icon: "folder_shared", name:"Share Folder"}
    ];
  }

  ngOnInit(): void {
  }

}
