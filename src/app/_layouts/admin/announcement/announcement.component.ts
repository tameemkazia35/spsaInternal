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
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})

export class AnnouncementComponent implements OnInit {
  items!: MenuItem[];
  uploadedImages: any = []
  imageSrc: any;
  editNews: boolean = false;
  newsForm!: FormGroup;
  bannerLang: any;
  pageSlug: any;
  pageData: any;
  parsedData: any;
  mediaPath: string = '';
  
  constructor(private messageService: MessageService, private route: ActivatedRoute, private formBuilder: FormBuilder, private service: ApiService, private spinner: NgxSpinnerService, private router: Router) {
    this.mediaPath = environment.mediaPath;
    this.items = [
      {label: 'Announcements', routerLink: '/admin/announcements'},
      {label: 'New', disabled: true}
  ];
  this.newsForm= this.formBuilder.group({
    "Title": ['', Validators.required],
    "Title_ar": ['', Validators.required],
    "Banner": ['', Validators.required],
    "Banner_ar": ['', Validators.required],
    "Content": ['', Validators.required],
    "Content_ar": ['', Validators.required],
    "Location": ['']
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_res => {
      debugger;
      if(_res?.type == 'edit'){
          this.editNews = true;
          this.pageSlug = _res.id;
          this.getPageBySlug();
      }
    })
  }

  getPageBySlug(){
    this.service.get(apis.pageByUrl, this.pageSlug).subscribe(_res=>{
      this.pageData = _res;
      this.parsedData = _res.page;
      this.newsForm.controls['Title'].setValue(this.parsedData.title);
      this.newsForm.controls['Title_ar'].setValue(this.parsedData.title_ar);
      this.newsForm.controls['Content'].setValue(this.parsedData.content);
      this.newsForm.controls['Content_ar'].setValue(this.parsedData.content_ar);
      this.newsForm.controls['Location'].setValue(this.parsedData.location);
      if(this.parsedData.banner.includes('http') > -1){
        this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
      }
      if(this.parsedData.banner_ar.includes('http') > -1){
        this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');
      }
      this.newsForm.controls['Banner'].setValue(this.mediaPath + this.parsedData.banner);
      this.newsForm.controls['Banner_ar'].setValue(this.mediaPath + this.parsedData.banner_ar);

      if(this.parsedData.pageMedias?.length > 0){
          this.parsedData.pageMedias.forEach((_item: { url: string; }) => {
              this.uploadedImages.push({imageUrl: this.mediaPath + _item.url})
          });
      }
    })
  }


  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const max_size = 2000;
          console.log('file.size', file.size);
          if (file.size / 1000 > max_size) {
            // this.genralService.openSnackBar(`Maximum size allowed is 20 MB`);
            // alert('Maximum size allowed is 5 MB');
            this.toastMessage('Image size warning', 'Maximum size allowed is 2MB', 'warn');
            return false;
          }

          const reader = new FileReader();

          reader.onload = (e) => {
            this.imageSrc = (e.target as unknown as HTMLInputElement);
            console.log('imageSrc', this.imageSrc.result);
            this.uploadAvatar(this.imageSrc.result, file);
          };
          reader.readAsDataURL(file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  uploadAvatar(_imageSrc: any, _file: File) {
    if(this.uploadedImages.length < 10){
      this.uploadedImages.push({
        imageUrl: _imageSrc,
        fileSize: this.formatBytes(_file.size),
        fileName: _file.name.replace(/ /g, '_'),
      });
      this.uploadMedia(_imageSrc);
    }else{
      this.toastMessage('Max warning', 'Maximum 10 images can be uploaded', 'warn');
    }
  }

  deleteDoc(index: number){
    this.uploadedImages.splice(index, 1);    
  }

  public fileOver(event: Event){
    console.log(event);
  }

  public fileLeave(event: Event){
    console.log(event);
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
  this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
  }

  uploadMedia(_base64: string){
    var payload = {"PagesId": this.pageData.page.id, "URL": _base64};
    this.service.post(apis.uploadMedia, payload).subscribe(_res=>{
      this.toastMessage('Success', 'Announcement media uploaded successfully', 'success');
    }, error=>{
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
    })
  }


  checkEditOrNew(){
    if(this.editNews){
      this.submiteditNews();
    }else{
      this.submit();
    }
  }

  submiteditNews(){
    this.parsedData.title = this.newsForm.value.Title;
    this.parsedData.title_ar = this.newsForm.value.Title_ar;
    this.parsedData.content = this.newsForm.value.Content;
    this.parsedData.content_ar = this.newsForm.value.Content_ar;
    this.parsedData.location = this.newsForm.value.Location;
    this.parsedData.banner = this.newsForm.value.Banner;
    if(this.parsedData.banner.includes('http') > -1){
      this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
    }
    this.parsedData.banner_ar = this.newsForm.value.Banner_ar;
    if(this.parsedData.banner_ar.includes('http') > -1){
      this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');
    }
    this.pageData.page = JSON.parse(JSON.stringify(this.parsedData));
    this.spinner.show();
    this.service.put(apis.pageUpdate, this.parsedData, this.pageData.page.id).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'News updated successfully', 'success');
      this.router.navigate(['/admin/events']);
    }, error=>{
      this.spinner.hide();
    })
  }

  submit(){
    var payload = {
      "Title": this.newsForm.value.Title,
      "Title_ar": this.newsForm.value.Title_ar,
      "Banner": this.newsForm.value.Banner,
      "Banner_ar": this.newsForm.value.Banner_ar,
      "Content": this.newsForm.value.Content,
      "Content_ar": this.newsForm.value.Content_ar,
      "Location": this.newsForm.value.Location,
      "Tags": 0,
      "PageComponents": {
          "ComponentsId": "event",
          "Data": ""
      }
  }
    console.log(this.newsForm.value);
    this.spinner.show();
    this.service.post(apis.createNews, payload).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Announcement added successfully', 'success');
      this.router.navigate(['/admin/announcements']);
    }, error=>{
      this.spinner.hide();
    })
  }

  handleFileSelect(evt: any, type: string){
    this.bannerLang = type;
    var files = evt.target.files;
    var file = files[0];

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
      this.newsForm.controls['Banner'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
   }

    if(this.bannerLang == 'ar'){
      this.newsForm.controls['Banner_ar'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
    }
  }    
}
