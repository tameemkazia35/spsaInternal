import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {MessageService} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { apis } from 'src/app/_enum/apiEnum';

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
  
  constructor(private messageService: MessageService, private route: ActivatedRoute, private formBuilder: FormBuilder, private service: ApiService) {
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
      if(_res?.type == 'edit'){
          this.editEvent = true;
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
            this.toastMessage('Image size warning', 'Maximum size allowed is 5MB', 'warn');
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


  submit(){
    
    this.service.post(apis.createEvent, '').subscribe(_res=>{

    })
  }

}
