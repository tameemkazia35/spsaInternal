import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string | undefined;
  invalidLogin: boolean = false;
  message: string | undefined;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router,private service: ApiService, private AuthenticationService: AuthenticationService, private route: ActivatedRoute) { 
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(8)
      ])]
    });

  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }
  
  submit(){
    this.submitted = true;
    this.AuthenticationService.login(this.loginForm.value)
    .subscribe(
        data => {
          
            if(data['message'] != undefined || data['message'] != null){
              //this.invalidLogin = true;
              this.message = data['message'];
              
            }
            if(this.returnUrl != '/'){
              this.router.navigate([this.returnUrl]);
            } else if(data.role == 'admin'){
              this.router.navigate(['admin/event/list']);
            } else if(data.role == 'it'){
              this.router.navigate(['it/user-management/list']);
            } else if(data.role == 'form'){
              this.router.navigate(['form/contacts/list']);
            } else if(data.role == 'media-user'){
              this.router.navigate(['media-user/event/list']);
            } else if(data.role == 'media-admin'){
              this.router.navigate(['media-admin/event/list']);
            } else{
              this.router.navigate(['admin/login']);
            }
        },
        error => {
           
        });
  }

}
