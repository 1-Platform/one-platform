import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { GraphQLModule } from 'app/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { SharedModule } from 'app/shared/shared.module';
import { TimelineScoreFormaterPipe } from './pipes/timeline-score-formater.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    PropertyCardComponent,
    AnalysisComponent,
    TimelineScoreFormaterPipe,
  ],
  providers: [TitleCasePipe],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GraphQLModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NgxChartsModule,
  ],
})
export class DashboardModule {}
