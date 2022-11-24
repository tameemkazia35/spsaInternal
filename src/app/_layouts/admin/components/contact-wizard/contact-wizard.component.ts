import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-contact-wizard',
  templateUrl: './contact-wizard.component.html',
  styleUrls: ['./contact-wizard.component.scss']
})
export class ContactWizardComponent implements OnInit {
  @Input() data: any;
  @Input() directories: any = [];
  @Output() contactData = new EventEmitter();
  contactForm!: FormGroup;
  display: boolean = false;
  selectedDepartment: any;
  @ViewChild('fileInput') fileInput: ElementRef | any;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, private service: ApiService) { 
    this.contactForm= this.formBuilder.group({
      name:['', Validators.required],
      name_ar:['', Validators.required],
      position:['', Validators.required],
      position_ar:['', Validators.required],
      mobile:[''],
      extension:['', Validators.required],
      photo:[''],
    })
  }

  ngOnInit(): void {
    debugger;
    console.log(this.data);
    if(this.data){
      
      if(this.data.schema == undefined){
        this.directories = {
          "code": "contacts",
          "schema": 
          [{
            "department": {
              "name": "",
              "name_ar": "",
              "contact": [
              ]
            }
          }]
        };
      }else{
        this.directories = this.data;
      }
    }else{
      this.directories = {
        "code": "contacts",
        "schema": 
        [{
          "department": {
            "name": "",
            "name_ar": "",
            "contact": [
            ]
          }
        }]
      };
    }
  }

  addContact(_dept: any){
    this.display= true;
    this.selectedDepartment = _dept
  }

  saveContact(){
    this.selectedDepartment.contact.push(this.contactForm.value);
    this.contactForm.reset();
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
    this.emitData();
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
   this.uploadMedia('data:image/png;base64, '+btoa(binaryString));

  }

  uploadMedia(_base64: string){
    var payload = {base64Content: _base64}
    this.service.post(apis.UploadMedias, payload).subscribe(_res=>{
      this.contactForm.controls['photo'].setValue(_res.url);
      console.log(this.contactForm.value);
    })
  }

  emitData(){
    this.contactData.emit(this.directories);
  }

  addNewDept(){
    this.directories.schema.push({
      "department": {
        "name": "",
        "name_ar": "",
        "contact": [
        ]
      }
    });
  }

  removeConfirm(department: any, contact: any){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the contact?',
      accept: () => {
        department.contact.splice(department.contact.indexOf(contact), 1);
      }
  });
  }
  
  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

}
