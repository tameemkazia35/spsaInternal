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
  searchText: any = '';
  sections: any;

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
      if(parseData.code == "documents"){
        this.services = parseData.schema.documents;
        this.services.forEach((_item: any) => {
          _item.icon = _item.banner;
        });
      }else{
        this.services = parseData.schema.links;
        this.services = this.services.filter( (sec:any) => (sec.isSection == false || sec.isSection == undefined) );
      var pageDataLinks = parseData.schema.links;
      this.sections = pageDataLinks.filter( (sec:any) => sec.isSection == true );
      }
    })
  }

  goToPage(_page: any){
    if(_page.target == "_self"){
      this.router.navigate([_page.url])
    }else{
      window.open(_page.url, '_blank');
    }
  }

  async imgError(_ev: any, _service: any){
    console.log('error', _ev);
    if(this.pageData.page.pageComponents.componentsId == 'documents'){
      _ev.target.src = await this.getFileExtension(_service);
    }else{
      _ev.target.src = "./assets/images/noimageavailable.png";
    }
  }

  getFileExtension(_service: any){
    if(_service.url){
      var file = _service.url.split('.')[_service.url.split('.').length - 1];
      if(file.toLowerCase() == 'pdf'){
        return './assets/images/' + file +'.png';
      }else{
        return './assets/images/doc.png';
      }
    }
  }
}