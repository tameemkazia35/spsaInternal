import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';
import {DropdownFilterOptions} from 'primeng/dropdown';
import * as _ from 'underscore';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss']
})
export class QuickLinksComponent implements OnInit {
  quickLinkForm = this.formBuilder.group({
    text: ['', Validators.required],
    text_ar: ['', Validators.required],
    url: ['', Validators.required],
    target: ['_blank', Validators.required],
    icon: [{ "iconName": "link","name":"link"}, Validators.required]
  });
  selectedList: any = [];
  submitted = false;

  quickLinks: any = [];
  iconList: any = [];
  display: boolean = false;
  selectedItem: any = [];
  filterValue = '';
  public options = { maxDepth: 1, disableDrag: true } as NestableSettings;

  constructor(private service: ApiService, private formBuilder: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getQuickLinks();
    this.getIcons();
  }

  getQuickLinks(){
    this.service.get(apis.MyQuickLinks, '').subscribe(_res=>{
      this.quickLinks = _res.quickLinks;
    })
  }

  getIcons(){
    this.service.getIcons().subscribe(_res=>{
      this.iconList = _res;
    })
  }

  deleteItem(_item:  any){
    debugger;
    this.service.delete(apis.MyQuickLinks+'/'+_item.id,'', '').subscribe(_res=>{
      this.quickLinks.splice(this.selectedList.indexOf(_item), 1);
      this.quickLinks = this.quickLinks.filter((_res: { $$id: any; }) => _res.$$id != _item.$$id);
      this.toastMessage('Success', 'Quick link deleted successfully');
    })
  }

  editItem( _item: any){
   this.selectedItem = _item;
   this.display = true;
   if(this.selectedItem.logo){
     this.selectedItem.logo = this.iconList.filter((_icon: any) => _icon.iconName == this.selectedItem.logo)[0];
   }
  }

  confirm(_item: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this link?',
        accept: () => {
            this.deleteItem(_item);
        }
    });
}



  resetFunction(options1: DropdownFilterOptions) {
    // options1.reset();
    this.filterValue = '';
}

  update(){
    var _ele = document.querySelector('.quick-form') as HTMLElement;
    if(_ele.classList.contains('ng-invalid')){
      return;
    }
    console.log('this.selectedItem', this.selectedItem);
    this.selectedItem.logo = this.selectedItem.logo.iconName;
    this.service.put(apis.MyQuickLinks, this.selectedItem,'/'+this.selectedItem.id).subscribe(_res=>{
      this.display = false;
      this.getQuickLinks();
      this.toastMessage('Success', 'Quick link updated successfully');
    })
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

  get f() { return this.quickLinkForm.controls; }
  submit() {
    this.submitted = true;
    if (this.quickLinkForm.invalid) {
      return;
    }

    var payload = {
      "slug": this.quickLinkForm.value.url,
      "text": this.quickLinkForm.value.text,
      "text_ar": this.quickLinkForm.value.text_ar,
      "target": this.quickLinkForm.value.target,
      "logo": this.quickLinkForm.value.icon?.iconName
    }

    this.service.post(apis.MyQuickLinks, payload).subscribe(_res=>{
      this.getQuickLinks();
      this.quickLinkForm.reset();
      this.quickLinkForm.markAsPristine();
      this.quickLinkForm.markAsUntouched();
      this.submitted= false;
      this.quickLinkForm.controls['icon'].setValue({ "iconName": "link","name":"link"});
      this.toastMessage('Success', 'Quick link added successfully');
    })
  }
}