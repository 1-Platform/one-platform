import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { RouterModule } from '@angular/router';
import { OutlinedPieGraphComponent } from './components/outlined-pie-graph/outlined-pie-graph.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LHCardLegendComponent } from './components/lhcard-legend/lhcard-legend.component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    OutlinedPieGraphComponent,
    LoaderComponent,
    LHCardLegendComponent,
  ],
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    AppLayoutComponent,
    OutlinedPieGraphComponent,
    LoaderComponent,
    LHCardLegendComponent,
  ],
})
export class SharedModule {}
