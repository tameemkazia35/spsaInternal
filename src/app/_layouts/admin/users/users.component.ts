import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: any = [];
  roles: any = [];
  clonedUser = {};
  userPopup: boolean = false;
  userForm!: FormGroup;
  userInfo = { id: null, name: '', username: '', password: '', rolesId: '' };
  submitted: boolean = false;

  fnGeneratePassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber +1);
     }
     return password;
  }

  constructor(private service: ApiService, private messageService: MessageService, private formBuilder: FormBuilder) {
    
    this.userForm= this.formBuilder.group({
      name:['', Validators.required],
      username:['', Validators.required],
      password:[this.fnGeneratePassword(), Validators.required],
      rolesId:['', Validators.required]
    })

  }

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  getUsers() {
    this.service.get(apis.users, '').subscribe(_res => {
      if (_res.users) {
        this.users = _res.users;
      }
    })
  }

  getRoles() {
    this.service.get(apis.roles, '').subscribe(_res => {
      this.roles = _res;
    });
  }

  onRowEditInit(user: any) {
    // this.clonedProducts[product.id] = {...product};
    this.clonedUser = JSON.parse(JSON.stringify(user));
  }

  onRowEditSave(user: any) {
    console.log(user.rolesId);

    this.service.post(apis.setUserRole + user.id + '/' + user.rolesId, '').subscribe(_res => {
      this.toastMessage('Success', 'User role updated successfully', 'success');
    })
  }

  onRowEditCancel(user: any, index: number) {
    this.users[index] = JSON.parse(JSON.stringify(this.clonedUser));
    this.clonedUser = {};
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({ life: 5000, severity: _severity, summary: _msg, detail: _desc });
  }

  get f() { return this.userForm.controls; }

  submitUser(){

    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    let reqPayload = {
      name: this.userForm.value.name,
      username: this.userForm.value.username,
      password: window.btoa(this.userForm.value.password),
      rolesId: this.userForm.value.rolesId
    };

    if(this.userInfo.id === null){
      // Add
      this.service.post(apis.users, reqPayload).subscribe(_res => {
        this.getUsers();
        this.toastMessage('Success', 'User added successfully', 'success');
      });
    }else {
      // Update
      this.service.put(apis.users +"/", reqPayload, this.userInfo.id).subscribe(_res => {
        this.getUsers();
        this.toastMessage('Success', 'User information updated successfully', 'success');
      });
    }

    this.submitted = false;
    this.userForm.reset();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userPopup = false;
    this.userInfo.id = null ;
  }

  fnSetGeneratePassword(){
    this.userForm.controls['password'].setValue( this.fnGeneratePassword() );
  }

  fnAddUserPopup() {
    this.userInfo = { id: null, name: '', username: '', password: '', rolesId: '' };
    this.userPopup = !this.userPopup
  }

  onSetUser(user: any) {
    this.userPopup = true;
    this.userInfo = user;
    //this.userInfo.id = user.id;
    // load all the 
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['username'].setValue(user.username);
    this.userForm.controls['password'].setValue( window.atob(user.password));
    this.userForm.controls['rolesId'].setValue(user.rolesId);
  }

}
