import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgXtruncateModule } from 'ngx-truncate';
import { FeedbackComponent } from './feedback.component';
import { FeedbackHomeComponent } from './home/feedback-home.component';
import {FeedbackItemComponent} from './feedback-item/feedback-item.component';
import {LoaderComponent} from '../../../app/common/loader/loader.component';
import {FeedbackService} from './feedback.service'; 



@NgModule({
  declarations: [
    FeedbackComponent, 
    FeedbackHomeComponent,
    FeedbackItemComponent,
    LoaderComponent,
  ],
  providers: [
    FeedbackService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    NgxPaginationModule,
    NgXtruncateModule,

  ]
})
export class FeedbackModule { }
