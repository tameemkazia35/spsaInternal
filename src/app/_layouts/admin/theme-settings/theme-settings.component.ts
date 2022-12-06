import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-theme-settings',
  templateUrl: './theme-settings.component.html',
  styleUrls: ['./theme-settings.component.scss']
})
export class ThemeSettingsComponent implements OnInit {
  rawdata: any;
  themeId: any;
  themeData: any = {primary: '', secondary:'', menuText: ''};
  constructor(private service: ApiService, private spinner: NgxSpinnerService, private messageService: MessageService, private util: UtilService) { }

  ngOnInit(): void {
    this.getTheme();
  }

  getTheme(){
    this.service.get(apis.themes, '').subscribe(_res=>{
      this.themeId = _res.id;
      this.rawdata = JSON.parse(_res.data);
      this.themeData.primary = this.rawdata.root[0].value;
      this.themeData.secondary = this.rawdata.root[1].value;
      this.themeData.menuText = this.rawdata.root[2].value;
      console.log('this.themeData', this.themeData);
    })
  }

  updateTheme(){
    this.rawdata.root[0].value = this.themeData.primary;
    this.rawdata.root[1].value = this.themeData.secondary;
    this.rawdata.root[2].value = this.themeData.menuText;
    var payload = {data: JSON.stringify(this.rawdata)};
    this.spinner.show();
    this.service.put(apis.updateTheme, payload, this.themeId).subscribe(_res=>{
      this.spinner.hide();
      if(_res.msg.toLowerCase() == 'success'){
        this.toastMessage('Success', 'Theme updated successfully');
        localStorage.setItem('themeData', JSON.stringify(this.themeData));
        var rootSudoElement: any = document.querySelector(':root');
        var rs : any = getComputedStyle(rootSudoElement);
        rootSudoElement.style.setProperty('--bs-primary', this.themeData.primary);
        rootSudoElement.style.setProperty('--bs-secondary', this.themeData.secondary);
        rootSudoElement.style.setProperty('--spsa-menu-text', this.themeData.menuText);
      }else{
        this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
      }
    }, error=>{
      this.spinner.hide();
      this.toastMessage('Error', 'Something went wrong. Please try again later', 'error');
    })
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({ life: 5000, severity: _severity, summary: _msg, detail: _desc });
  }

}
