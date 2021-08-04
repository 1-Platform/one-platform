import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLModule } from 'app/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';

import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [HomeComponent, PropertyCardComponent, AnalysisComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GraphQLModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
  ],
})
export class DashboardModule {}
