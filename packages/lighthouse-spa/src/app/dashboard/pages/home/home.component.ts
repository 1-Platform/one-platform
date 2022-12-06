import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../../../dashboard/dashboard.service';
import { environment } from '../../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  lighthouseContactMail = environment.LH_CONTACT_MAIL;

  isProjectListLoading = true;
  projects: Pagination<LHProject[]> = { count: 0, rows: [] };

  // project search input state
  searchProject = '';
  searchControl = new Subject<string>();
  debouncedSearchProject = '';
  dashboardServiceSub: Subscription;

  isEmpty = false;
  sites = '';
  validUrl = false;
  selectedPreset = 'perf';
  presets = [
    {
      name: 'Performance',
      value: 'perf',
    },
    {
      name: 'Desktop',
      value: 'desktop',
    },
    {
      name: 'Experimental',
      value: 'experimental',
    },
  ];
  taglines = [
    {
      title: 'Run Tests on your site',
      subtitle:
        "Enter your site's url to see how well it performs across all audits.",
    },
    {
      title: ' Look at what matters',
      subtitle: "See your site's performance across the areas you care about.",
    },
    {
      title: ' Get tips for improving',
      subtitle:
        "Each test comes with helpful steps to improve your site's results.",
    },
  ];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchControl
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: (searchTerm: string) => {
          this.debouncedSearchProject = searchTerm;
        },
      });
    this.dashboardServiceSub = this.dashboardService
      .listLHProjects()
      .subscribe(({ data, loading }) => {
        this.isProjectListLoading = loading;
        this.projects = data.listLHProjects;
        this.isEmpty = data.listLHProjects.count === 0;
      });
  }

  ngOnDestroy(): void {
    this.searchControl.unsubscribe();
    this.dashboardServiceSub.unsubscribe();
  }

  validateUrl(url: string): void {
    this.validUrl = url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
  }

  navigateToReportGeneration(): void {
    this.router.navigate(['/playground'], {
      queryParams: {
        siteUrl: this.sites,
        preset: this.selectedPreset,
      },
    });
  }

  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchProject = searchTerm;
    this.searchControl.next(searchTerm);
  }
}
