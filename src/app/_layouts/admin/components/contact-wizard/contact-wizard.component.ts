import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import * as _ from 'underscore';

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
  selectedSection: any;
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
      sort: [1]
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
              "sort": 1,
              "name": "",
              "name_ar": "",
              "contact": [
              ]
            }
          }]
        };
      }else{
        this.directories = this.data;
        this.directories.schema = _.sortBy(this.directories.schema, 'sort', 'desc');
        this.directories.schema.forEach((_directory: any, index: any) => {
          _directory.department.sections = _.sortBy(_directory.department.sections, 'sort', 'desc');
          _directory.sort = _directory.sort ? parseInt(_directory.sort) : index + 1;
          _directory.department.sections.forEach((_section: any, sindex: any) => {
            _section.sort = _section.sort ? parseInt(_section.sort) : sindex + 1;
            _section.contacts = _.sortBy(_section.contacts, 'sort', 'desc');
            _section.contacts.forEach((_contact: any, cindex: any)=> {
              _contact.sort = parseInt(_contact.sort) ? _contact.sort : cindex + 1;
            });
          });
        });
        console.log('this.directories', this.directories);
      }
    }else{
      this.directories = {
        "code": "contacts",
        "schema":
        [{
          "department": {
            "sort": 1,
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
    this.selectedSection = _dept;
    debugger;
    this.contactForm.controls['sort'].setValue(this.selectedSection.contacts.length + 1);
  }

  get f() { return this.contactForm.controls; }
  saveContact(){
    debugger;
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }

    if (this.editLink) {
      this.selectedSection.contacts[this.cloneOject.id] = this.contactForm.value;
      this.editLink = false;
      this.display = false;
      delete this.cloneOject;
    } else {
      this.selectedSection.contacts.push(this.contactForm.value);
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
    this.directories.schema.forEach((_dept: any) => {
      _dept.sort = parseInt(_dept.sort);
      _dept.department.sections.forEach((_section: any) => {
        _section.sort = parseInt(_section.sort);
        _section.contacts.forEach((_contact: any) => {
          _contact.sort = JSON.parse(_contact.sort);
        });
      });
    });
    debugger;
    this.contactData.emit(this.directories);
  }

  addNewDept(){
    this.directories.schema.push({
      "department": {
        "sort": this.directories.schema.length + 1,
        "name": "",
        "name_ar": "",
        "sections": [
          {
            "sort": 1,
            "name": "",
            "name_ar": "",
            "contacts": []
        }
        ]
      }
    });
  }

  addSection2Depart(deptIndx:number){
    debugger;
    this.directories.schema[deptIndx]["department"]['sections'].push({
        "sort": this.directories.schema[deptIndx]["department"]['sections'].length + 1,
        "name": "",
        "name_ar": "",
        "contacts": []
    });
  }

  removeConfirm(section: any, contact: any){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the contact?',
      accept: () => {
        section.contacts.splice(section.contacts.indexOf(contact), 1);
      }
  });
  }

  deleteSection(department: any, index: any){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete the section?',
      accept: () => {
        department['department'].sections.splice(index, 1);
      }
  });
  }

  edit(_department: any, _deptIndex: any, _section: any, _secIndex: any,  _contact: any, _ind: any){
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
      // select here
      this.selectedSection = _section;
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
  }

}