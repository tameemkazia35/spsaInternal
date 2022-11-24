import { Component, OnInit } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NestableSettings } from 'ngx-nestable/lib/nestable.models';
import { DropdownFilterOptions } from 'primeng/dropdown';
import * as _ from 'underscore';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  searchTerm: any = '';
  pageList: any = [];
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

  constructor(private service: ApiService, private formBuilder: FormBuilder, private messageService: MessageService) {
    this.externalForm = this.formBuilder.group({
      text: ['', Validators.required],
      text_ar: ['', Validators.required],
      url: ['', Validators.required],
      target: ['_blank', Validators.required],
      icon: [{ "iconName": "link", "name": "link" }, Validators.required]
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


  getMenus() {
    this.service.get(apis.menus, '').subscribe(_res => {
      this.menuDetails = _res[0];
      this.selectedId = _res[0].id;
      this.menuDetails.menuItems.forEach((_item: { isExternal: any; text: any; text_ar: any; LinkUrl: any; slug: any; pages: { name: any; name_ar: any; }; IsExternal: any; expanded: boolean; children: any[]; }) => {
        var children: any[] = [];
        if (_item.isExternal) {
          _item.text = _item.text;
          _item.text_ar = _item.text_ar;
          _item.slug = _item.slug;
        } else {
          _item.text = _item.text == undefined ? _item.pages.name : _item.text;
          _item.text_ar = _item.text_ar == undefined ? _item.pages.name_ar : _item.text_ar;
        }
        _item.IsExternal = _item.isExternal
        _item.expanded = true;
        _item.children = children;
        this.tempList.push(_item);
      });

      this.selectedList = JSON.parse(JSON.stringify(this.tempList));
      this.selectedList = _.sortBy(this.selectedList, 'orderNo', 'asc');
    })
  }

  getIcons() {
    this.service.getIcons().subscribe(_res => {
      this.iconList = _res;
    })
  }

  addPages() {
    this.tempList = JSON.parse(JSON.stringify(this.selectedList));
    this.pageList.forEach((_item: any) => {
      if (_item.checked) {
        var payload = {
          "MenusId": this.selectedId,
          "IsExternal": false,
          "Text": _item.title,
          "Text_ar": _item.title_ar,
          "Slug": _item.slug,
          "Target": "_self",
          "orderNo": this.selectedList.length + 1,
          "IconName": _item.iconName,
          "pagesId": _item.id,
          "id": ""
        }
        this.tempList.push(payload);
        _item.checked = false;
      }
    });
    this.selectedList = JSON.parse(JSON.stringify(this.tempList));
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
    this.tempList = JSON.parse(JSON.stringify(this.selectedList));
      this.tempList.push(payload);
      this.selectedList = JSON.parse(JSON.stringify(this.tempList));
  }

  update() {
    var payload: any = [];
    this.selectedList.forEach((_item: any, _ind: number) => {
      if (_item.IsExternal) {
        payload.push({
          "MenusId": this.selectedId,
          "IsExternal": true,
          "Text": _item.text,
          "Text_ar": _item.text_ar,
          "Slug": _item.slug,
          "Target": "_self",
          "orderNo": _ind + 1,
          "IconName": _item.iconName,
          "pagesId": _item.pagesId,
          "id": _item.id
        })
      } else {
        payload.push({
          "MenusId": this.selectedId,
          "orderNo": _ind + 1,
          "pagesId": _item.pagesId,
          "Target": "",
          "isExternal": false,
          "Text": _item.text,
          "Text_ar": _item.text_ar,
          "IconName": _item.iconName,
          "Slug": _item.slug,
          "id": _item.id
        });
      }
    });
    console.log(payload);
    this.service.put(apis.updateMenuItems, payload, this.selectedId).subscribe(_res => {
      this.toastMessage('Success', 'Menu list updated successfully');
    })
  }

  deleteItem(_item: any) {
    this.selectedList.splice(this.selectedList.indexOf(_item), 1);
      this.selectedList = this.selectedList.filter((_res: { $$id: any; }) => _res.$$id != _item.$$id)
      this.selectedList.forEach((_res: { children: any[]; }) => {
        _res.children = _res.children.filter((_res1: { $$id: any; }) => _res1.$$id != _item.$$id)
      });
  }

  editItem(_item: any) {
    this.selectedItem = _item;
    this.display = true;
  }

  resetFunction(options1: DropdownFilterOptions) {
    // options1.reset();
    this.filterValue = '';
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({life: 5000,severity: _severity, summary: _msg, detail: _desc});
    }

    updateMenuItem(){
      
    }
  

}
