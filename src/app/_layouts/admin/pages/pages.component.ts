import { Component, OnInit, ViewChild } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  pageList: any = [];
  loading: boolean = true;
  @ViewChild('dt2') dt: Table | undefined;

  constructor(private service: ApiService, private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPages();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getPages(){
    this.service.get(apis.allPages, '').subscribe(_res=>{
      this.pageList = _res;
      this.loading = false;
    })
  }

  goToPage(_page: { slug: any; id: any; }){
    this.router.navigate(['admin/page'], {queryParams: { slug: _page.slug, type: 'edit'}})
  }

  newPage(){
    this.router.navigate(['admin/page']);
  }

  removePage(_id: any){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this page?',
      accept: () => {
          this.service.delete(apis.deletePage, _id, '').subscribe(_res=>{
            this.getPages();
            this.toastMessage('Success', 'Page successfully deleted.');
          })
      }
  });
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }
}