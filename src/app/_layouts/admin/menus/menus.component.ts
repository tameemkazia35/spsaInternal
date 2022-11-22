import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';
import {DropdownFilterOptions} from 'primeng/dropdown';
import * as _ from 'underscore';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  searchTerm: any ='';
  pageList: any =[];
  tempList: any = [];
  submitted = false;
  selectedId: any;
  externalForm!: FormGroup;
  selectedList: any = [];
  menuDetails: any;
  public options = { maxDepth: 1 } as NestableSettings;
  public list = [
    { 'id': 1 },
    {
      'expanded': true,
      'id': 2, 'children': [
        { 'id': 3 },
        { 'id': 4 },
        {
          'expanded': false,
          'id': 5, 'children': [
            { 'id': 6 },
            { 'id': 7 },
            { 'id': 8 }
          ]
        },
        { 'id': 9 },
        { 'id': 10 }
      ]
    },
    { 'id': 11 }
  ];
  selectedItem: any = [];
  display: boolean = false;
  iconList: any;
  filterValue = '';

  constructor(private service: ApiService, private formBuilder: FormBuilder,) { 
    this.externalForm = this.formBuilder.group({
      text: ['', Validators.required],
      text_ar: ['', Validators.required],
      url: ['', Validators.required],
      target: ['_blank', Validators.required],
      icon: [{ "iconName": "link","name":"link"}, Validators.required]
    })
  }

  ngOnInit(): void {
    this.getPageList();
    this.getMenus();
    this.getIcons();
  }

  getPageList() {
    this.service.get(apis.allPages, '').subscribe(_res => {
      this.pageList = _res;
    })
  }


  getMenus(){
    this.service.get(apis.menus, '').subscribe(_res =>{
      this.menuDetails = _res[0];
      this.selectedId = _res[0].id;
      this.menuDetails.menuItems.forEach((_item: { isExternal: any; text: any; text_ar: any; LinkUrl: any; slug: any; pages: { name: any; name_ar: any; }; IsExternal: any; expanded: boolean; children: any[]; }) => {
        var children: any[] = [];
      if(_item.isExternal){
        _item.text = _item.text;
        _item.text_ar = _item.text_ar;
        _item.slug = _item.slug;
      }else{
        _item.text = _item.text == undefined ? _item.pages.name : _item.text;
        _item.text_ar = _item.text_ar == undefined ? _item.pages.name_ar : _item.text_ar;
      }
      _item.IsExternal = _item.isExternal
      _item.expanded = true;
      _item.children= children;
        this.tempList.push(_item);
      });
      
    this.selectedList = JSON.parse(JSON.stringify(this.tempList));
    this.selectedList = _.sortBy(this.selectedList, 'orderNo', 'asc');
    })
  }

getIcons(){
  this.service.getIcons().subscribe(_res=>{
    this.iconList = _res;
  })
}

  addPages(){

  }

  get f() { return this.externalForm.controls; }
  submit() {
    this.submitted = true;
    if (this.externalForm.invalid) {
      return;
    }
    
    var payload = {
    "MenusId": this.selectedId,
		"isExternal": true,
		"text": this.externalForm.value.text,
		"text_ar": this.externalForm.value.text_ar,
		"slug": this.externalForm.value.url,
    "target": this.externalForm.value.target,
    "orderNo": this.selectedList.length + 1,
    "iconName": this.externalForm.value.icon.iconName
  }
  console.log(payload);
  this.service.post(apis.menuItems, payload).subscribe(_res=>{
    this.tempList = JSON.parse(JSON.stringify(this.selectedList));
    this.tempList.push(payload);
    this.selectedList = JSON.parse(JSON.stringify(this.tempList));
  })
  }

  update() {
    
  }
  deleteItem(_item:  any){
    debugger;
    this.service.delete(apis.menuItems+'/'+_item.id,'', '').subscribe(_res=>{
      this.selectedList.splice(this.selectedList.indexOf(_item), 1);
      this.selectedList = this.selectedList.filter((_res: { $$id: any; }) => _res.$$id != _item.$$id)
      this.selectedList.forEach((_res: { children: any[]; }) => {
        _res.children = _res.children.filter((_res1: { $$id: any; }) => _res1.$$id != _item.$$id)
      });  
    })
  }

  editItem( _item: any){
   this.selectedItem = _item;
   this.display = true;
  }

  resetFunction(options1: DropdownFilterOptions) {
    // options1.reset();
    this.filterValue = '';
}

}
