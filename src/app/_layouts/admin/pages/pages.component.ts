import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  pages: any = [];

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this.service.get(apis.allPages, '').subscribe(_res=>{
      this.pages = _res;
    });
  }

}
