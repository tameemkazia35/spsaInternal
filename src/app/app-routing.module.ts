import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './_layouts/admin/admin.component';
import { AnnouncementComponent } from './_layouts/admin/announcement/announcement.component';
import { AnnouncementsComponent } from './_layouts/admin/announcements/announcements.component';
import { EventComponent } from './_layouts/admin/event/event.component';
import { EventsComponent } from './_layouts/admin/events/events.component';
import { MenusComponent } from './_layouts/admin/menus/menus.component';
import { PageComponent } from './_layouts/admin/page/page.component';
import { PagesComponent } from './_layouts/admin/pages/pages.component';
import { QuickLinksComponent } from './_layouts/admin/quick-links/quick-links.component';
import { UsersComponent } from './_layouts/admin/users/users.component';
import { InternalComponent } from './_layouts/internal/internal.component';
import { EventDetailsComponent } from './_layouts/internal/pages/event-details/event-details.component';
import { EventListComponent } from './_layouts/internal/pages/event-list/event-list.component';
import { HomeComponent } from './_layouts/internal/pages/home/home.component';

const routes: Routes = [
  { 
    path: '', 
    component: InternalComponent,
    children: [
    { 
      path: 'home', 
      component: HomeComponent
    },
    { 
      path: 'event/:slug', 
      component: EventDetailsComponent
    },
    { 
      path: 'event', 
      component: EventListComponent
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    }
]
},
{
  path: 'admin',
  component: AdminComponent,
  children: [
    { 
      path: 'menu', 
      component: MenusComponent
    },
    // { 
    //   path: 'sections', 
    //   component: SectionsComponent
    // },
    { 
       path: 'pages', 
       component: PagesComponent
    },
    { 
      path: 'events', 
      component: EventsComponent
    },
    { 
      path: 'event', 
      component: EventComponent
    },
    { 
      path: 'announcements', 
      component: AnnouncementsComponent
    },
    { 
      path: 'announcement', 
      component: AnnouncementComponent
    },
    { 
      path: 'quick-links', 
      component: QuickLinksComponent
    },
    { 
      path: 'pages', 
      component: PagesComponent
    },
    { 
      path: 'page', 
      component: PageComponent
    },
    // { 
    //   path: 'directory', 
    //   component: DirectoryComponent
    // },
    { 
      path: 'users', 
      component: UsersComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
