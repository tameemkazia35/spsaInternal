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
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MenuModule } from 'primeng/menu';
import { MenusComponent } from './_layouts/admin/menus/menus.component';
import { AccordionModule } from 'primeng/accordion';
import { NestableModule } from 'ngx-nestable';
import { EventsComponent } from './_layouts/admin/events/events.component';
import { UsersComponent } from './_layouts/admin/users/users.component';
// import { IconsModalComponent } from './_common/icons-modal/icons-modal.component';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ServerErrorInterceptor } from './_guards/server-error.interceptor';
import { BasicAuthInterceptor } from './_guards/basic-auth.guard';
import { EventComponent } from './_layouts/admin/event/event.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilterArrayPipe } from './_pipes/filter-array.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnnouncementsComponent } from './_layouts/admin/announcements/announcements.component';
import { AnnouncementComponent } from './_layouts/admin/announcement/announcement.component';
import { QuickLinksComponent } from './_layouts/admin/quick-links/quick-links.component';
import { DirectoryComponent } from './_layouts/admin/directory/directory.component';
import { PagesComponent } from './_layouts/admin/pages/pages.component';
import { InputTextModule } from 'primeng/inputtext';
import { PageComponent } from './_layouts/admin/page/page.component';
import { OthersComponent } from './_layouts/admin/components/others/others.component';
import { HomeWizardComponent } from './_layouts/admin/components/home-wizard/home-wizard.component';
import { ContactWizardComponent } from './_layouts/admin/components/contact-wizard/contact-wizard.component';
import { FieldsetModule } from 'primeng/fieldset';
import { LinksWizardComponent } from './_layouts/admin/components/links-wizard/links-wizard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { EventListComponent } from './_layouts/internal/pages/event-list/event-list.component';
import { EventDetailsComponent } from './_layouts/internal/pages/event-details/event-details.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InnerPagesComponent } from './_layouts/internal/pages/inner-pages/inner-pages.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { DividerModule } from 'primeng/divider';
import { ThemeSettingsComponent } from './_layouts/admin/theme-settings/theme-settings.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CardModule } from 'primeng/card';
import { DocWizardComponent } from './_layouts/admin/components/doc-wizard/doc-wizard.component';
import { VisitorLogComponent } from './_layouts/visitor-log/visitor-log.component';
import { NgxIntlTelephoneInputModule } from 'ngx-intl-telephone-input';
import { VisitorsComponent } from './_layouts/admin/visitors/visitors.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Calendar } from 'primeng/calendar';

export function getWindow() {
  return window;
}

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
]);

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
    AnnouncementsComponent,
    AnnouncementComponent,
    QuickLinksComponent,
    DirectoryComponent,
    PagesComponent,
    PageComponent,
    OthersComponent,
    HomeWizardComponent,
    ContactWizardComponent,
    LinksWizardComponent,
    EventListComponent,
    EventDetailsComponent,
    InnerPagesComponent,
    ThemeSettingsComponent,
    DocWizardComponent,
    VisitorLogComponent,
    VisitorsComponent,
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
    MenuModule,
    AccordionModule,
    NestableModule,
    DropdownModule,
    TableModule,
    BreadcrumbModule,
    CalendarModule,
    EditorModule,
    NgxFileDropModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    FieldsetModule,
    FullCalendarModule,
    Ng2SearchPipeModule,
    SpeedDialModule,
    DividerModule,
    ColorPickerModule,
    CardModule,
    ConfirmPopupModule,
    NgxIntlTelephoneInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    MessageService,
    Calendar,
    ConfirmationService,
    { provide: 'Window', useFactory: getWindow },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
