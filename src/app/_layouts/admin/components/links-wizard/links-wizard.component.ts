import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-links-wizard',
  templateUrl: './links-wizard.component.html',
  styleUrls: ['./links-wizard.component.scss']
})
export class LinksWizardComponent implements OnInit {
  @Input() data: any;
  @Output() otherData = new EventEmitter();
  quickLinkForm = this.formBuilder.group({
    text: ['', Validators.required],
    text_ar: ['', Validators.required],
    desc: [''],
    desc_ar: [''],
    url: ['', Validators.required],
    target: ['_blank', Validators.required],
    icon: [''],
    raw: ['']
  });

  submitted = false;
  display: boolean = false;
  quickLinks: any = [];
  editLink: boolean = false;
  cloneOject: any;
  @ViewChild('fileInput') fileInput: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, private service: ApiService) { }

  ngOnInit(): void {
    if(this.data){
      this.quickLinks = JSON.parse(this.data);
    }else{
    this.quickLinks = {
      "code": "links",
      "schema": 
      {
       'links': [] 
      }};
  }
}

handleFileSelect(evt: any){
  var files = evt.target.files;
  var file = files[0];
  if(file.size > 1024000){
    this.toastMessage('Image size warning', 'Maximum size allowed is 1MB', 'warn');
    this.fileInput.nativeElement.value = "";
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
//  this.quickLinkForm.controls['base64'].setValue('data:image/png;base64, '+btoa(binaryString));
 console.log(btoa(binaryString));
 this.uploadMedia('data:image/png;base64, '+btoa(binaryString))
}

uploadMedia(_base64: string){
  var payload = {base64Content: _base64}
  this.service.post(apis.UploadMedias, payload).subscribe(_res=>{
    this.quickLinkForm.controls['icon'].setValue(_res.url);
    console.log(this.quickLinkForm.value);
  })
}

  addLinks(){
    this.display = true;
  }

  get f() { return this.quickLinkForm.controls; }
  Add(){
    debugger;
    this.submitted = true;
    if (this.quickLinkForm.invalid) {
      return;
    }
    
    if(this.editLink){
      
      this.quickLinks.schema.links.splice(this.quickLinks.schema.links.indexOf(this.cloneOject), 1);
      this.quickLinks.schema.links.push(this.quickLinkForm.value);
      this.editLink = false;
      delete this.cloneOject;
    }else{
      console.log(this.quickLinkForm.value);
      this.quickLinks.schema.links.push(this.quickLinkForm.value);
    }
    this.quickLinkForm.reset();
    this.quickLinkForm.markAsPristine();
    this.quickLinkForm.markAsUntouched();
    this.display = false;
    this.submitted = false;
    this.quickLinkForm.controls['target'].setValue('_blank');
    this.emitData();
  }

  Edit(_data: any){
    // this.quickLinkForm.controls['text'].setValue(_data.text);
    // this.quickLinkForm.controls['text_ar'].setValue(_data.text_ar);
    // this.quickLinkForm.controls['desc'].setValue(_data.desc);
    // this.quickLinkForm.controls['desc_ar'].setValue(_data.desc_ar);
    // this.quickLinkForm.controls['url'].setValue(_data.url);
    // this.quickLinkForm.controls['target'].setValue(_data.target);
    // this.quickLinkForm.controls['icon'].setValue(_data.icon);
    this.display = true;
  }

  emitData(){
    this.otherData.emit(this.quickLinks);
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

    removeConfirm(link: any){
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete the link?',
        accept: () => {
         this.quickLinks.schema.links.splice(this.quickLinks.schema.links.indexOf(link), 1);
        }
    });
    }

    edit(_link: any){
      this.editLink = true;
      this.quickLinkForm.controls['text'].setValue(_link.text);
    this.quickLinkForm.controls['text_ar'].setValue(_link.text_ar);
    this.quickLinkForm.controls['desc'].setValue(_link.desc);
    this.quickLinkForm.controls['desc_ar'].setValue(_link.desc_ar);
    this.quickLinkForm.controls['url'].setValue(_link.url);
    this.quickLinkForm.controls['target'].setValue(_link.target);
    this.quickLinkForm.controls['icon'].setValue(_link.icon);
      this.cloneOject = _link;
      this.display= true;
    }

}
