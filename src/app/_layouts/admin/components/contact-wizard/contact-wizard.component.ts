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
  editLink: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef | any;
  cloneOject: any;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService, private service: ApiService) { 
    this.contactForm= this.formBuilder.group({
      name:['', Validators.required],
      name_ar:['', Validators.required],
      position:['', Validators.required],
      position_ar:['', Validators.required],
      mobile:[''],
      extension:[''],
      photo:[''],
    })
  }

  ngOnInit(): void {
    
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

  get f() { return this.contactForm.controls; }
  saveContact(){
    debugger;
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }

    if (this.editLink) { 
      this.selectedDepartment.contact[this.cloneOject.id] = this.contactForm.value;
      this.editLink = false;
      this.display = false;
      delete this.cloneOject;
    } else {
      this.selectedDepartment.contact.push(this.contactForm.value);
    }
    this.submitted = false;
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
        "sections": []
      }
    });
  }

  addSection2Depart(deptIndx:number){
    this.directories.schema[deptIndx]["sections"].push({
      "sections": {
        "name": "",
        "name_ar": "",
        "contacts": []
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

  edit(_contact: any, _ind: any){
      this.editLink = true;
      this.contactForm.controls['name'].setValue(_contact.name);
      this.contactForm.controls['name_ar'].setValue(_contact.name_ar);
      this.contactForm.controls['position'].setValue(_contact.position);
      this.contactForm.controls['position_ar'].setValue(_contact.position_ar);
      this.contactForm.controls['mobile'].setValue(_contact.mobile);
      this.contactForm.controls['extension'].setValue(_contact.extension);
      this.contactForm.controls['photo'].setValue(_contact.photo);
      this.cloneOject = _contact;
      this.cloneOject.id = _ind;
      this.display = true;
  }
  
  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

}
