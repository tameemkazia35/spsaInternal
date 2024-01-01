import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { UtilService } from 'src/app/_services/util.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
// import * as moment from 'moment';

@Component({
  selector: 'app-visitor-log',
  templateUrl: './visitor-log.component.html',
  styleUrls: ['./visitor-log.component.scss'],
})
export class VisitorLogComponent implements OnInit {
  selectedLang: string = 'en';
  currentTime: string = '';
  currentSec: string = '';
  currentPeriod: string = '';
  currentDay: string = '';
  currentMonth: string = '';
  currentYear: string = '';
  currentWeekDay: string = '';
  visitTime: string = '';
  redirecting: string = '';
  animationDuration: number = 1;
  visitorForm!: FormGroup;
  public CountryISO: any;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  currentLang: any;
  langItems!: MenuItem[];
  reasons!: MenuItem[];
  departments!: MenuItem[];
  submitted: boolean = false;
  thankYou: boolean = false;
  countdown: number = 5;
  timer: any;

  constructor(
    private formBuilder: FormBuilder,
    private util: UtilService,
    private service: ApiService,
    private spinner: NgxSpinnerService,
    private translateService: TranslateService
  ) {
    this.updateClock();
    this.spinner.show('visitor');
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;

    this.visitorForm = this.formBuilder.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      contact: ['', Validators.required],
      email: [''],
      department: ['', Validators.required],
      reason: ['', Validators.required],
      in: [''],
    });
    this.getPreData();
  }

  ngOnInit(): void {
    this.currentLang = this.util.getCurrentLang();
    this.selectedLang = this.currentLang;
    this.langItems = [{ label: 'En' }, { label: 'Ar' }];
    setTimeout(() => {
      this.spinner.hide('visitor');
    }, 1000);

    var Html = document.querySelector('html') as HTMLElement;
    this.util.observLang().subscribe((_res) => {
      console.log('_res', _res);
      if (_res == 'en') {
        Html.setAttribute('dir', 'ltr');
        Html.setAttribute('lang', 'en');
        return;
      }

      if (_res == 'ar') {
        Html.setAttribute('dir', 'rtl');
        Html.setAttribute('lang', 'ar');
        return;
      }
    });
  }

  setLang() {
    this.util.setLang(this.selectedLang);
    this.currentLang = this.selectedLang;
    localStorage.setItem('lang', this.selectedLang);
    this.translateService.setDefaultLang(this.selectedLang);
  }

  updateClock() {
    const now = new Date();

    // Format the time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = hours % 12 || 12;
    this.currentTime = `${this.padZero(twelveHourFormat)}:${this.padZero(
      minutes
    )}`;
    this.currentSec = this.padZero(seconds);
    this.currentPeriod = period;
    // Format the date
    this.currentDay = now.toLocaleString('en-US', { day: 'numeric' });
    this.currentMonth = now.toLocaleString('en-US', { month: 'short' });
    this.currentWeekDay = now.toLocaleString('en-US', { weekday: 'long' });
    this.currentYear = now.toLocaleString('en-US', { year: 'numeric' });
    // Update the clock every second
    setTimeout(() => {
      this.updateClock();
    }, 1000);
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  onInputChange(event: any) {
    this.visitorForm.controls['contact'].setValue(event);
    if (event.isNumberValid) {
      this.getVisitorInfo(
        event.phoneNumber.replaceAll(' ', '').replace('+', '')
      );
    }
  }

  getPreData = () => {
    this.service.get(apis.visitorsPreData, '').subscribe((res) => {
      this.reasons = res.reasons;
      this.departments = res.departments;
    });
  };

  getVisitorInfo = (mobile: any) => {
    this.service.get(apis.visitorInfo, '?cn=' + mobile).subscribe((res) => {
      this.visitorForm.controls['name'].setValue(res.visitor.name);
      this.visitorForm.controls['email'].setValue(res.visitor.email);
      this.visitorForm.controls['company'].setValue(res.visitor.company);
    });
  };

  startCountdown() {
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.stopCountdown();
        this.thankYou = false;
      }
    }, 1000);
  }

  stopCountdown() {
    this.countdown = 5;
    clearInterval(this.timer);
  }

  get f() {
    return this.visitorForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.visitorForm.invalid) {
      return;
    }
    const visitTime = this.currentTime + this.currentPeriod;
    const timezone = 'Asia/Dubai'; // Replace with your desired timezone
    const currentDatetime: string = moment()
      .tz(timezone)
      .format('YYYY-MM-DDTHH:mm:ss');
    const payload = {
      name: this.visitorForm.value.name,
      Company: this.visitorForm.value.company,
      ContactNo: this.visitorForm.value.contact?.phoneNumber.replaceAll(
        ' ',
        ''
      ),
      Email: this.visitorForm.value.email,
      Department: this.visitorForm.value.department,
      Reason: this.visitorForm.value.reason,
      LogIn: currentDatetime,
    };
    this.service.post(apis.visitors, payload).subscribe((res) => {
      this.submitted = false;
      this.visitorForm.reset();
      const ele = document.querySelector('.phoneInput') as HTMLInputElement;
      ele.value = '';
      this.visitorForm.markAsPristine();
      this.visitorForm.markAsUntouched();
      this.visitTime = 'login time: ' + visitTime.replace(/ /g, '');
      this.thankYou = true;
      this.startCountdown();
      setTimeout(() => {
        this.thankYou = false;
      }, 40000);
    });
  }
}
