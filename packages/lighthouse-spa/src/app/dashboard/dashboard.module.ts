import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLModule } from 'app/graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';

import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, PropertyCardComponent, AnalysisComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SharedModule,
  ],
})
export class DashboardModule {}
