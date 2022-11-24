import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-inner-pages',
  templateUrl: './inner-pages.component.html',
  styleUrls: ['./inner-pages.component.scss']
})
export class InnerPagesComponent implements OnInit {
  services: any;
  currentLang: any;
  pageData: any;

  constructor(private service: ApiService, private route: ActivatedRoute, private router: Router, private util: UtilService) {
    this.route.params.subscribe((_res: any)=>{
      this.getPageBySlug('/page/'+_res.url);
    })
   }

  ngOnInit(): void {
    this.currentLang = this.util.getCurrentLang();
    this.util.observLang().subscribe(_res=>{
      this.currentLang = _res;
    });
  }

  getPageBySlug(_url: string){
    this.service.get(apis.pageByUrl, _url).subscribe(_res=>{
      this.pageData = _res;
      var parseData = JSON.parse(_res.page.pageComponents.data);
      this.services = parseData.schema.links;
    })
  }

  goToPage(_page: any){
    if(_page.target == "_self"){
      this.router.navigate([_page.url])
    }else{
      window.open(_page.url, '_blank');
    }
  }
}