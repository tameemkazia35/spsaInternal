import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './_layouts/internal/pages/home/home.component';
import { InternalComponent } from './_layouts/internal/internal.component';
import { LoginComponent } from './_layouts/login/login.component';
import { ContactComponent } from './_layouts/internal/pages/contact/contact.component';
import { AdminComponent } from './_layouts/admin/admin.component';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from "ngx-spinner";
import {MenubarModule} from 'primeng/menubar';
import { MenusComponent } from './_layouts/admin/menus/menus.component';
import {AccordionModule} from 'primeng/accordion';
import { NestableModule } from 'ngx-nestable';
import { EventsComponent } from './_layouts/admin/events/events.component';
import { UsersComponent } from './_layouts/admin/users/users.component';
// import { IconsModalComponent } from './_common/icons-modal/icons-modal.component';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import { ServerErrorInterceptor } from './_guards/server-error.interceptor';
import { BasicAuthInterceptor } from './_guards/basic-auth.guard';
import { EventComponent } from './_layouts/admin/event/event.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {CalendarModule} from 'primeng/calendar';
import {EditorModule} from 'primeng/editor';
import { NgxFileDropModule } from 'ngx-file-drop';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FilterArrayPipe } from './_pipes/filter-array.pipe';
import { PagesComponent } from './_layouts/admin/pages/pages.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InternalComponent,
    LoginComponent,
    ContactComponent,
    AdminComponent,
    MenusComponent,
    FilterArrayPipe,
    EventsComponent,
    UsersComponent,
    EventComponent,
    PagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    MenubarModule,
    AccordionModule,
    NestableModule,
    DropdownModule,
    TableModule,
    BreadcrumbModule,
    CalendarModule,
    EditorModule,
    NgxFileDropModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [ 
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}