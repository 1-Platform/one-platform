import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = true;
  properties: Properties[] = [];
  isEmpty = false;
  sites = '';
  validUrl = false;
  selectedPreset = 'lighthouse:recommended';
  presets = [
    {
      name: 'All',
      value: 'lighthouse:all',
    },
    {
      name: 'Recommended',
      value: 'lighthouse:recommended',
    },
    {
      name: 'No PWA',
      value: 'lighthouse:no-pwa',
    },
  ];
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService
      .listLHProperties()
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        this.properties = data.listLHProperties;
        this.isEmpty = data.listLHProperties.length === 0;
      });
  }

  validateUrl(url: string) {
    this.validUrl = url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
  }

  navigateToReportGeneration() {
    // this.router.navigateByUrl(`/?site_url=${this.sites}`);
    this.router.navigate(['/playground'], {
      queryParams: {
        siteUrl: this.sites,
        preset: this.selectedPreset,
      },
    });
  }
}
