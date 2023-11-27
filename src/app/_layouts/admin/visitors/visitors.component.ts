import { Inject, Component, OnInit, ViewChild } from '@angular/core';
import { apis } from 'src/app/_enum/apiEnum';
import { ApiService } from 'src/app/_services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-telephone-input';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import * as moment from 'moment-timezone';
import { Table } from 'primeng/table';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss'],
})
export class VisitorsComponent implements OnInit {
  @ViewChild('dt1') dt: Table | undefined;
  visitors: any = [];
  visitorsList: any = [];
  visitorPopup: boolean = false;
  public CountryISO: any;
  visitorForm!: FormGroup;
  public PhoneNumberFormat: any;
  public SearchCountryField: any;
  reasons!: MenuItem[];
  departments!: MenuItem[];
  submitted: boolean = false;
  selectedVisitor: any = { contactNo: '' };
  rangeDates: any = [new Date(), new Date()];
  cols: any;
  selectedType: any;
  loaded: boolean = true;
  @ViewChild('mycal') calendar: any;

  constructor(
    private service: ApiService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    @Inject('Window') private window: Window
  ) {
    this.CountryISO = CountryISO;
    this.PhoneNumberFormat = PhoneNumberFormat;
    this.SearchCountryField = SearchCountryField;

    //id,name,company,contactNo,email,department,reason,logIn,logOut,comments,isDeleted,createdOn,updatedOn
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'company', header: 'Company' },
      { field: 'contactNo', header: 'Mobile' },
      { field: 'email', header: 'Email' },
      { field: 'department', header: 'Department' },
      { field: 'reason', header: 'Reason' },
      { field: 'logInFormat', header: 'Log In' },
      { field: 'logOutFormat', header: 'Log Out' },
      { field: 'comments', header: 'Comments' },
    ];
    this.visitorForm = this.formBuilder.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      contactNo: ['', Validators.required],
      email: [''],
      department: ['', Validators.required],
      reason: ['', Validators.required],
      logInFormat: [''],
      logOut: [''],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.customRangeClick('Last 30 days');
    this.getPreData();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getVisitors = (from: any, to: any) => {
    const startPage = 0;
    const pageSize = 5000;
    this.service
      .get(
        apis.visitors,
        `?sd=${from}&ed=${to}&startPage=${startPage}&pageSize=${pageSize}`
      )
      .subscribe((_res) => {
        this.loaded = true;
        this.visitors = _res.data;
        this.visitors.map((visitor: any) => {
          visitor.logInFormat = moment(visitor.logIn).format(
            'DD-MM-YYYY HH:mm a'
          );
          visitor.logOutFormat = moment(visitor.logOut).format(
            'DD-MM-YYYY HH:mm a'
          );
        });
      });
  };

  getPreData = () => {
    this.service.get(apis.visitorsPreData, '').subscribe((res) => {
      this.reasons = res.reasons;
      this.departments = res.departments;
    });
  };

  modalChange = () => {
    this.selectedType = 0;
    this.rangeChange();
  };

  rangeChange = () => {
    if (this.rangeDates) {
      let fd = moment(this.rangeDates[0]).format('YYYY-MM-DD');
      let ld = this.rangeDates[1]
        ? moment(this.rangeDates[1]).format('YYYY-MM-DD')
        : fd;
      this.getVisitors(fd, ld);
    }
  };

  // deleteVisitor = (visitor: any) => {
  //   visitor.isDeleted = true;
  //   this.service
  //     .put(apis.visitors + '/' + visitor.id, visitor, '')
  //     .subscribe((_res) => {});
  // };

  deleteVisitor(visitor: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this visitor?',
      accept: () => {
        this.service
          .delete(apis.visitors + '/', visitor.id, '')
          .subscribe((_res) => {
            this.toastMessage('Success', 'Visitor successfully deleted.');
            visitor.isDeleted = true;
          });
      },
    });
  }

  toastMessage(_msg: string, _desc: string, _severity: string = 'success') {
    this.messageService.add({
      life: 5000,
      severity: _severity,
      summary: _msg,
      detail: _desc,
    });
  }

  onSetVisitor = (visitor: any) => {
    this.visitorPopup = true;
    this.selectedVisitor = visitor;
    visitor.logOut = visitor.logOut ? new Date(visitor.logOut) : null;
    visitor.logIn = visitor.logIn ? new Date(visitor.logIn) : null;
    debugger;
    this.visitorForm.patchValue(visitor);
  };
  onInputChange(event: any) {
    this.visitorForm.controls['contact'].setValue(event);
  }

  get f() {
    return this.visitorForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.visitorForm.invalid) {
      return;
    }
    const timezone = 'Asia/Dubai'; // Replace with your desired timezone
    const currentDatetime = this.visitorForm.value.logOut
      ? moment(this.selectedVisitor.logIn).tz(timezone).format('YYYY-MM-DDT') +
        moment(this.visitorForm.value.logOut).tz(timezone).format('HH:mm:ss')
      : null;
    const payload = {
      id: this.selectedVisitor.id,
      name: this.visitorForm.value.name,
      company: this.visitorForm.value.company,
      contactNo: this.visitorForm.value.contactNo,
      email: this.visitorForm.value.email,
      department: this.visitorForm.value.department,
      reason: this.visitorForm.value.reason,
      logIn: this.selectedVisitor.logIn,
      logOut: currentDatetime,
      comments: this.visitorForm.value.comments,
    };
    debugger;
    this.service
      .put(apis.visitors + '/' + this.selectedVisitor.id, payload, '')
      .subscribe((res) => {
        console.log('res', res.msg);
        const logInFormat = this.selectedVisitor.logInFormat;
        const logOutFormat = this.selectedVisitor.logOutFormat;
        this.selectedVisitor = payload;
        this.selectedVisitor.logInFormat = logInFormat;
        this.selectedVisitor.logOutFormat = logOutFormat;
        const index = this.visitors.findIndex(
          (item: any) => item.id === this.selectedVisitor.id
        );
        if (index !== -1) {
          this.visitors[index] = this.selectedVisitor;
        }
        console.log('this.visitors', this.visitors);
        this.submitted = false;
        this.visitorPopup = false;
        this.visitorForm.reset();
        this.visitorForm.markAsPristine();
        this.visitorForm.markAsUntouched();
        this.messageService.add({
          severity: 'success',
          summary: 'Successfully updated',
        });
      });
  }

  customRangeClick(range: string): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (range) {
      case 'Today':
        this.rangeDates = [today, today];
        this.selectedType = 1;
        break;
      case 'Yesterday':
        this.rangeDates = [yesterday, yesterday];
        this.selectedType = 2;
        break;
      case 'Last 7 days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        this.rangeDates = [sevenDaysAgo, today];
        this.selectedType = 3;
        break;
      case 'Last 30 days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        this.rangeDates = [thirtyDaysAgo, today];
        this.selectedType = 4;
        break;
      case 'This month':
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        this.rangeDates = [firstDayOfMonth, today];
        this.selectedType = 5;
        break;
      case 'Last 3 months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        this.rangeDates = [threeMonthsAgo, today];
        this.selectedType = 6;
        break;
      default:
        break;
    }

    this.rangeChange();
  }

  close = () => {
    this.calendar.toggle();
  };
}
