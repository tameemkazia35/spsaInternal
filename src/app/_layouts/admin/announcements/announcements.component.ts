import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})

export class AnnouncementsComponent implements OnInit {
  allnews: any = [];
  searchText: any = '';
  
  constructor(private service: ApiService, private confirmationService: ConfirmationService, private router: Router, private messageService: MessageService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getNews();
  }

  getNews(){
    this.service.get(apis.news, '').subscribe(_res=>{
      this.allnews = _res;
    })
  }

  removeNews(_newsId: any){
    this.spinner.show();
    this.service.delete(apis.deletePage, _newsId, '').subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'News successfully deleted.', 'success');
      this.getNews();
    }, error=>{
      this.spinner.hide();
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
    })
  }

  editNews(_newsId: any){
    this.router.navigate(['/admin/announcement'], {queryParams: {type:'edit', id: _newsId}});
  }

  toggleEventStatus(_eventId: any, _event: any){

  }

  confirm(_id: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this announcement?',
        accept: () => {
            this.removeNews(_id);
        }
    });
}

toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
  this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
  }

}

