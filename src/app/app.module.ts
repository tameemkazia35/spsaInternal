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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InternalComponent,
    LoginComponent,
    ContactComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
