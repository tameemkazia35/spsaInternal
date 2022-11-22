import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-icons-modal',
  templateUrl: './icons-modal.component.html',
  styleUrls: ['./icons-modal.component.scss']
})
export class IconsModalComponent implements OnInit {
  iconList: any;

  constructor(private service: ApiService) { }

  ngOnInit(): void {
  }

  getIcons(){
    this.service.getIcons().subscribe(_res=>{
      this.iconList = _res;
    })
  }

}
