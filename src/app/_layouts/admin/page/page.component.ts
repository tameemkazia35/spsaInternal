import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {MessageService} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { apis } from 'src/app/_enum/apiEnum';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  items!: MenuItem[];
  uploadedImages: any = []
  imageSrc: any;
  editPage: boolean = false;
  pageForm!: FormGroup;
  bannerLang: any;
  pageSlug: any;
  pageData: any;
  parsedData: any;
  mediaPath: string = '';
  pageComponents: any = {components: {id: 'links'}, data: null };
  submitted: boolean = false;
  showLink: boolean = false;

  constructor(private messageService: MessageService, private route: ActivatedRoute, private formBuilder: FormBuilder, private service: ApiService, private spinner: NgxSpinnerService, private router: Router) { 
    this.mediaPath = environment.mediaPath;
    

  this.pageForm= this.formBuilder.group({
    "Title": ['', Validators.required],
    "Title_ar": ['', Validators.required],
    "Banner": [''],
    "Banner_ar": [''],
    "Content": [''],
    "Content_ar": ['']
    })

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_res => {
      if(_res?.type == 'edit'){
          this.editPage = true;
          this.pageSlug = _res.slug;
          this.getPageBySlug();
      }else{
        this.items = [
          {label: 'Pages', routerLink: '/admin/pages'},
          {label: 'New Link Page', disabled: true}
      ];
      this.showLink = true;
      }
    })
  }

  getPageBySlug(){
    this.service.get(apis.pageByUrl, this.pageSlug).subscribe(_res=>{
      this.items = [
        {label: 'Pages', routerLink: '/admin/pages'},
        {label: _res.page.title, disabled: true}
    ];
     
     console.log(this.items);
     this.pageData = _res;
     this.parsedData = _res.page;
     this.pageForm.controls['Title'].setValue(this.parsedData.title);
     this.pageForm.controls['Title_ar'].setValue(this.parsedData.title_ar);
     this.pageForm.controls['Content'].setValue(this.parsedData.content);
     this.pageForm.controls['Content_ar'].setValue(this.parsedData.content_ar);
     
     if(this.parsedData.banner.includes('http') > -1){
       this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
     }

     if(this.parsedData.banner_ar.includes('http') > -1){
       this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');      
     }
     
     if(this.pageData.page.pageComponents.components){
        this.pageComponents.components.id = this.pageData.page.pageComponents.components.id;
      }
     
     if(this.pageData.page.pageComponents.components){
       if(this.pageData.page.pageComponents.data)
        this.pageComponents.data = JSON.parse(this.pageData.page.pageComponents.data);
     }
     this.showLink = true;
    })
  }


  handleFileSelect(evt: any, type: string){
    this.bannerLang = type;
    var files = evt.target.files;
    var file = files[0];
    if(file.size > 1024000){
      this.toastMessage('Image size warning', 'Maximum size allowed is 1MB', 'warn');
      return;
    }
  if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
  }
}



_handleReaderLoaded(readerEvt: any) {
   var binaryString = readerEvt.target.result;
   console.log(btoa(binaryString));
   if(this.bannerLang == 'en'){
      this.pageForm.controls['Banner'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
   }

    if(this.bannerLang == 'ar'){
      this.pageForm.controls['Banner_ar'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
    }
  } 

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

    recieveData(_ev: any){
      this.pageComponents.data = _ev;
      console.log(_ev);
    }
  
  checkEditOrNew(){
    if(this.editPage){
      this.submitEditEvent();
    }else{
      this.submit();
    }
  }
  get f() { return this.pageForm.controls; }
  submit(){
    debugger;
    this.submitted = true;
    if (this.pageForm.invalid) {
      return;
    }

    var payload = {
      "Title": this.pageForm.value.Title,
      "Title_ar": this.pageForm.value.Title_ar,
      "Banner": this.pageForm.value.Banner,
      "Banner_ar": this.pageForm.value.Banner_ar,
      "Content": this.pageForm.value.Content,
      "Content_ar": this.pageForm.value.Content_ar,
      "Tags": 0,
      "PageComponents": {
          "ComponentsId": this.pageComponents.components.Id,
          "Data": JSON.stringify(this.pageComponents.data)
      }
    }
    this.spinner.show();
    this.service.post(apis.createPage, payload).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Page added successfully', 'success');
      this.router.navigate(['/admin/pages']);
    }, error=>{
      this.spinner.hide();
    })
  }

  

  submitEditEvent(){
    this.parsedData.title = this.pageForm.value.Title;
    this.parsedData.title_ar = this.pageForm.value.Title_ar;
    this.parsedData.content = this.pageForm.value.Content;
    this.parsedData.content_ar = this.pageForm.value.Content_ar;
    this.parsedData.banner = this.pageForm.value.Banner;
    if(this.parsedData.banner.includes('http') > -1){
      this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
    }
    this.parsedData.banner_ar = this.pageForm.value.Banner_ar;
    if(this.parsedData.banner_ar.includes('http') > -1){
      this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');
    }

    this.pageData.page = JSON.parse(JSON.stringify(this.parsedData));
    this.parsedData.pageComponents.data = JSON.stringify(this.pageComponents.data);
    this.spinner.show();
    this.service.put(apis.pageUpdate, this.parsedData, this.pageData.page.id).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Page updated successfully', 'success');
      // this.router.navigate(['/admin/events']);
    }, error=>{
      this.spinner.hide();
    })
  }

}
