import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = true;
  properties: Properties[] = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService
      .listLHProperties()
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        this.properties = data.listLHProperties;
      });
  }
}
