import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  },
]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
