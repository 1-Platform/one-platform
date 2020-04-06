import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: IndexComponent,
  },
  {
    path: 'manage',
    component: ManageNotificationComponent,
  },
  {
    path: 'manage/new',
    redirectTo: '/manage',
    pathMatch: 'full',
  },
  {
    path: 'manage/edit/:id',
    component: ManageNotificationComponent,
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
