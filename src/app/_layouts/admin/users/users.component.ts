import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
users: any = [];
roles: any = [];
clonedUser= {};
  constructor(private service: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  getUsers(){
    this.service.get(apis.users, '').subscribe(_res=>{
      if(_res.users){
        this.users = _res.users;
      }
    })
  }

  getRoles(){
    this.service.get(apis.roles, '').subscribe(_res=>{
      this.roles = _res;
    });
  }

  onRowEditInit(user: any) {
    // this.clonedProducts[product.id] = {...product};
    this.clonedUser = JSON.parse(JSON.stringify(user));
}

onRowEditSave(user: any) {
  console.log(user.rolesId);
  
    this.service.post(apis.setUserRole+user.id+'/'+user.rolesId, '').subscribe(_res=>{
      this.toastMessage('Success', 'User role updated successfully', 'success');
    })
}

onRowEditCancel(user: any, index: number) {
  debugger;
  this.users[index] = JSON.parse(JSON.stringify(this.clonedUser));
  this.clonedUser = {};
}

toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
  this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
  }

}
