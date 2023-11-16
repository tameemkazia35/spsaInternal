import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-doc-wizard',
  templateUrl: './doc-wizard.component.html',
  styleUrls: ['./doc-wizard.component.scss']
})
export class DocWizardComponent implements OnInit {
  @Input() data: any;
  @Output() otherData = new EventEmitter();
  docForm = this.formBuilder.group({
    text: ['', Validators.required],
    text_ar: ['', Validators.required],
    desc: [''],
    desc_ar: [''],
    url: ['', Validators.required],
    banner: [''],
    raw: ['']
  });

  submitted = false;
  display: boolean = false;
  docLinks: any = [];
  editDoc: boolean = false;
  cloneOject: any;
  imageSrc: any;
  bannerLang: any;
  @ViewChild('fileInput') fileInput: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, private service: ApiService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    if (this.data) {
      this.docLinks = this.data;
    } else {
      this.docLinks = {
        "code": "documents",
        "schema":
        {
          'documents': []
        }
      };
    }
  } 
  
  addDoc(){
    this.display = true;
  }

  get f() { return this.docForm.controls; }
  add(){
    this.submitted = true;
    if (this.docForm.invalid) {
      return;
    }
    if (this.editDoc) { 
      this.docLinks.schema.documents[this.cloneOject.id] = this.docForm.value;
      this.editDoc = false;
      delete this.cloneOject;
    } else {
      console.log(this.docForm.value);
      this.docLinks.schema.documents.push(this.docForm.value);
      console.log('this.docLinks', this.docLinks);
    }
    this.docForm.reset();
    this.docForm.markAsPristine();
    this.docForm.markAsUntouched();
    this.display = false;
    this.submitted = false;
    this.emitData();
  }

  editDialog(_data: any) {
    this.display = true;
  }

  emitData(){
    debugger;
    this.otherData.emit(this.docLinks);
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const max_size = 60000;
          console.log('file.size', file.size);
          if (file.size / 1000 > max_size) {
            // this.genralService.openSnackBar(`Maximum size allowed is 20 MB`);
            // alert('Maximum size allowed is 5 MB');
            this.toastMessage('Image size warning', 'Maximum size allowed is 60MB', 'warn');
            return false;
          }

          const reader = new FileReader();

          reader.onload = (e) => {
            this.imageSrc = (e.target as unknown as HTMLInputElement);
            console.log('imageSrc', this.imageSrc.result);
            this.uploadMedia(this.imageSrc.result, 'doc');
          };
          reader.readAsDataURL(file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  uploadMedia(_base64: string, _type: any){
    var payload = {base64Content: _base64};
    this.service.post(apis.UploadMedias, payload).subscribe(_res=>{
      if(_res){
        if(_type == 'banner'){
          this.docForm.controls['banner'].setValue(_res.url);
        }

        if(_type == 'doc'){
          this.docForm.controls['url'].setValue(_res.url);
        }

        this.toastMessage('Success', 'Document uploaded successfully', 'success');
      }else{
        this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
      }
    }, error=>{
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
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
      // this.docForm.controls['banner'].setValue('data:image/png;base64,'+btoa(binaryString));
      this.uploadMedia('data:image/png;base64, ' + btoa(binaryString), 'banner')
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
    this.messageService.add({ life: 5000, severity: _severity, summary: _msg, detail: _desc });
  }

  removeConfirm(doc: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the doc?',
      accept: () => {
        this.docLinks.schema.documents.splice(this.docLinks.schema.documents.indexOf(doc), 1);
      }
    });
  }

  edit(_doc: any, _ind: any){
    this.editDoc = true;
    this.docForm.controls['text'].setValue(_doc.text);
    this.docForm.controls['text_ar'].setValue(_doc.text_ar);
    this.docForm.controls['desc'].setValue(_doc.desc);
    this.docForm.controls['desc_ar'].setValue(_doc.desc_ar);
    this.docForm.controls['url'].setValue(_doc.url);
    this.docForm.controls['banner'].setValue(_doc.banner);
    this.cloneOject = _doc;
    this.cloneOject.id = _ind;
    this.display = true;
  }

  async imgError(_ev: any, _service: any){
    _ev.target.src = await this.getFileExtension(_service);
  }

  getFileExtension(_item: any){
    if(_item.url){
      var file = _item.url.split('.')[_item.url.split('.').length - 1];
      if(file.toLowerCase() == 'pdf'){
        return './assets/images/' + file +'.svg';
      }else{
        return './assets/images/doc.svg';
      }
    }
  }

}
