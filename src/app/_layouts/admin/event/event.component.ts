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
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  items!: MenuItem[];
  uploadedImages: any = []
  imageSrc: any;
  editEvent: boolean = false;
  eventForm!: FormGroup;
  bannerLang: any;
  pageSlug: any;
  pageData: any;
  parsedData: any;
  mediaPath: string = '';
  
  constructor(private messageService: MessageService, private route: ActivatedRoute, private formBuilder: FormBuilder, private service: ApiService, private spinner: NgxSpinnerService, private router: Router) {
    this.mediaPath = environment.mediaPath;
    this.items = [
      {label: 'Events', routerLink: '/admin/events'},
      {label: 'New', disabled: true}
  ];
  this.eventForm= this.formBuilder.group({
    "Title": ['', Validators.required],
    "Title_ar": ['', Validators.required],
    "Banner": ['', Validators.required],
    "Banner_ar": ['', Validators.required],
    "Content": ['', Validators.required],
    "Content_ar": ['', Validators.required],
    "Location": ['', Validators.required],
    "startDateTime": ['', Validators.required],
    "endDateTime": ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(_res => {
      debugger;
      if(_res?.type == 'edit'){
          this.editEvent = true;
          this.pageSlug = _res.id;
          this.getPageBySlug();
      }
    })
  }

  getPageBySlug(){
    this.service.get(apis.pageByUrl, this.pageSlug).subscribe(_res=>{
      this.pageData = _res;
      this.parsedData = _res.page;
      this.eventForm.controls['Title'].setValue(this.parsedData.title);
      this.eventForm.controls['Title_ar'].setValue(this.parsedData.title_ar);
      this.eventForm.controls['Content'].setValue(this.parsedData.content);
      this.eventForm.controls['Content_ar'].setValue(this.parsedData.content_ar);
      this.eventForm.controls['Location'].setValue(this.parsedData.location);
      if(this.parsedData.banner.includes('http') > -1){
        this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
      }
      if(this.parsedData.banner_ar.includes('http') > -1){
        this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');
      }
      this.eventForm.controls['Banner'].setValue(this.mediaPath + this.parsedData.banner);
      this.eventForm.controls['Banner_ar'].setValue(this.mediaPath + this.parsedData.banner_ar);
      this.eventForm.controls['startDateTime'].setValue(new Date(this.parsedData.startDateTime));
      this.eventForm.controls['endDateTime'].setValue(new Date(this.parsedData.endDateTime));
      if(this.parsedData.pageMedias?.length > 0){
        this.parsedData.pageMedias.forEach((_item: any) => {
            this.uploadedImages.push({imageUrl: this.mediaPath + _item.url, id: _item.id});
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
      this.uploadMedia(_imageSrc);
    }else{
      this.toastMessage('Max warning', 'Maximum 10 media files can be uploaded', 'warn');
    }
  }

  uploadMedia(_base64: string){
    var payload = {"PagesId": this.pageData.page.id, "URL": _base64};
    this.service.post(apis.uploadMedia, payload).subscribe(_res=>{
      if(_res.media){
        this.uploadedImages.push({
          imageUrl: _res.media.url,
          id: _res.media.id,
          mime: _res.media.mime,
          pagesId: _res.media.pagesId
        });
        this.toastMessage('Success', 'Announcement media uploaded successfully', 'success');
      }else{
        this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');  
      }
    }, error=>{
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
    })
  }

  deleteDoc(media: any, index: number){
    this.service.delete(apis.uploadMedia+'/', media.id, '').subscribe(_res=>{
      this.uploadedImages.splice(index, 1);    
      this.toastMessage('Success', 'Media deleted successfully');
    })
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


  checkEditOrNew(){
    if(this.editEvent){
      this.submitEditEvent();
    }else{
      this.submit();
    }
  }

  submitEditEvent(){
    this.parsedData.title = this.eventForm.value.Title;
    this.parsedData.title_ar = this.eventForm.value.Title_ar;
    this.parsedData.content = this.eventForm.value.Content;
    this.parsedData.content_ar = this.eventForm.value.Content_ar;
    this.parsedData.location = this.eventForm.value.Location;
    this.parsedData.banner = this.eventForm.value.Banner;
    if(this.parsedData.banner.includes('http') > -1){
      this.parsedData.banner = this.parsedData.banner.replace(this.mediaPath, '');
    }
    this.parsedData.banner_ar = this.eventForm.value.Banner_ar;
    if(this.parsedData.banner_ar.includes('http') > -1){
      this.parsedData.banner_ar = this.parsedData.banner_ar.replace(this.mediaPath, '');
    }
    this.parsedData.startDateTime = this.eventForm.value.startDateTime;
    this.parsedData.endDateTime = this.eventForm.value.endDateTime;
    this.pageData.page = JSON.parse(JSON.stringify(this.parsedData));
    this.spinner.show();
    this.service.put(apis.pageUpdate, this.parsedData, this.pageData.page.id).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Event updated successfully', 'success');
      this.router.navigate(['/admin/events']);
    }, error=>{
      this.spinner.hide();
    })
  }

  submit(){
    var payload = {
      "Title": this.eventForm.value.Title,
      "Title_ar": this.eventForm.value.Title_ar,
      "Banner": this.eventForm.value.Banner,
      "Banner_ar": this.eventForm.value.Banner_ar,
      "Content": this.eventForm.value.Content,
      "Content_ar": this.eventForm.value.Content_ar,
      "Location": this.eventForm.value.Location,
      "startDateTime": this.eventForm.value.startDateTime,
      "endDateTime": this.eventForm.value.endDateTime,
      "Tags": 0,
      "PageComponents": {
          "ComponentsId": "event",
          "Data": ""
      }
  }
    console.log(this.eventForm.value);
    this.spinner.show();
    this.service.post(apis.createEvent, payload).subscribe(_res=>{
      this.spinner.hide();
      this.toastMessage('Success', 'Event added successfully', 'success');
      this.router.navigate(['/admin/events']);
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
      this.eventForm.controls['Banner'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
   }

    if(this.bannerLang == 'ar'){
      this.eventForm.controls['Banner_ar'].setValue('data:image/png;base64,'+btoa(binaryString));
      return;
    }
  }    
}
