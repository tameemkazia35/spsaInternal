import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
users: any = [];
roles: any = [];
clonedUser= {};
  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
    this.roles = [{id:1, name:'admin'}, {id:2, name:'user'}]
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

    });
  }

  onRowEditInit(user: any) {
    // this.clonedProducts[product.id] = {...product};
    this.clonedUser = JSON.parse(JSON.stringify(user));
}

onRowEditSave(user: any) {
    
}

onRowEditCancel(user: any, index: number) {
  debugger;
  this.users[index] = JSON.parse(JSON.stringify(this.clonedUser));
  this.clonedUser = {};
}

}
