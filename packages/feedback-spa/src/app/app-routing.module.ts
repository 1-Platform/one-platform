import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { FeedbackHomeComponent } from './feedback/home/feedback-home.component';

const routes: Routes = [
  {
  path: '',
  component: FeedbackHomeComponent,
},
];
@NgModule({
  imports: [RouterModule.forRoot(routes , { preloadingStrategy: NoPreloading, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
