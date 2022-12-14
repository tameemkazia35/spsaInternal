import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  returnUrl: string | undefined;
  invalidLogin: boolean = false;
  message: string | undefined;
  submitted = false;
  domains: any = [];

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private service: ApiService, private AuthenticationService: AuthenticationService, private route: ActivatedRoute, private util: UtilService, private spinner: NgxSpinnerService) {
    
    this.loginForm = this.formBuilder.group({
      domain: ['', Validators.required],
      username: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    });

  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getDomain();
  }

  getDomain(){
    this.service.get(apis.adDomains, '').subscribe(_res=>{
      this.domains = _res.domains.split(',');
      this.loginForm.value.domain = this.domains[0];
    })
  }

  get f() { return this.loginForm.controls; }

  submit() {
    this.submitted = true;
    var payload = { "email": this.loginForm.value.username, password: window.btoa(this.loginForm.value.password)};
    this.spinner.show();
    this.AuthenticationService.login(payload)
      .subscribe(
        data => {
          if(data){
            data.email = this.loginForm.value.username;
            this.util.publishlogin(data);
          }
        },
        error => {

        });
  }
}