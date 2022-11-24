import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactList: any; 
  filteredContact: any;
  pageData: any;
  currentLang: any;
  searchText: any = '';

  constructor(private router: Router, private service: ApiService, private util: UtilService) { }

  ngOnInit(): void {
    this.getPageBySlug();
    this.currentLang = this.util.getCurrentLang();
    this.util.observLang().subscribe(_res=>{
      this.currentLang = _res;
    });
  }

  getPageBySlug(){
    this.service.get(apis.pageByUrl, '/contacts').subscribe(_res=>{
      this.pageData = _res;
      var parseData = JSON.parse(_res.page.pageComponents.data);
      this.contactList = parseData.schema;
      console.log(this.contactList[0])
    })
  }

  goToSection(_dept: any, ind: any){
      this.searchText = '';
      var ele = document.querySelector('.directory-'+ind);
      ele = ele as HTMLElement;
      ele.scrollIntoView({ behavior: 'smooth', block: 'center' });;
  }

}
