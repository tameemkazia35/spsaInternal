import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './_layouts/admin/admin.component';
import { EventComponent } from './_layouts/admin/event/event.component';
import { EventsComponent } from './_layouts/admin/events/events.component';
import { MenusComponent } from './_layouts/admin/menus/menus.component';
import { UsersComponent } from './_layouts/admin/users/users.component';
import { InternalComponent } from './_layouts/internal/internal.component';
import { HomeComponent } from './_layouts/internal/pages/home/home.component';

const routes: Routes = [
  { 
    path: '', 
    component: InternalComponent,
    children: [
    { 
      path: 'en/home', 
      component: HomeComponent
    },
    {
      path: '',
      redirectTo: 'en/home',
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
    // { 
    //   path: 'pages', 
    //   component: PagesComponent
    // },
    { 
      path: 'events', 
      component: EventsComponent
    },
    { 
      path: 'event', 
      component: EventComponent
    },
    // { 
    //   path: 'announcements', 
    //   component: AnnouncementsComponent
    // },
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
