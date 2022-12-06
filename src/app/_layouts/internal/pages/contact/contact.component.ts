import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
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
  items: MenuItem[];
  active: boolean = false;
  allContacts: any =[];
  
  constructor(private router: Router, private service: ApiService, private util: UtilService, private spinner: NgxSpinnerService) {
    this.items = [
      {
          label: 'pencil',
          command: () => {
              // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          }
      },
      {
          icon: 'pi pi-refresh',
          command: () => {
              // this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
          }
      },
      {
          icon: 'pi pi-trash',
          command: () => {
              // this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
          }
      },
      {
          icon: 'pi pi-upload',
          routerLink: ['/fileupload']
      },
      {
          icon: 'pi pi-external-link',
          url: 'http://angular.io'

      }
  ];

   }

  ngOnInit(): void {
    this.getPageBySlug();
    this.currentLang = this.util.getCurrentLang();
    this.util.observLang().subscribe(_res=>{
      this.currentLang = _res;
    });
  }

  getPageBySlug(){
    this.spinner.show();
    this.allContacts = [];
    this.service.get(apis.pageByUrl, '/contacts').subscribe(_res=>{
      this.pageData = _res;
      var parseData = JSON.parse(_res.page.pageComponents.data);
      this.contactList = parseData.schema;
      this.contactList.forEach((_dept: any) => {
          _dept.department.sections.forEach((_contact: any) => {
              this.allContacts.push(..._contact.contacts);
          });
      });
      console.log('this.allContacts', this.allContacts);
      this.spinner.hide();
    }, error=>{
      this.spinner.hide();
    })
  }

  goToSection(_dept: any, ind: any){
      this.searchText = '';
      var ele = document.querySelector('.directory-'+ind);
      ele = ele as HTMLElement;
      ele.scrollIntoView({ behavior: 'smooth', block: 'center' });;
  }

}
