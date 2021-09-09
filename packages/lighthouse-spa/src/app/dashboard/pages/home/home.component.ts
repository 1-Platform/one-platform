import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from 'app/dashboard/dashboard.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
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
    this.dashboardService
      .listLHProjects()
      .valueChanges.subscribe(({ data, loading }) => {
        this.isProjectListLoading = loading;
        this.projects = data.listLHProjects;
        this.isEmpty = data.listLHProjects.count === 0;
      });
  }

  ngOnDestroy() {
    this.searchControl.unsubscribe();
  }

  validateUrl(url: string) {
    this.validUrl = url.indexOf('http://') == 0 || url.indexOf('https://') == 0;
  }

  navigateToReportGeneration() {
    this.router.navigate(['/playground'], {
      queryParams: {
        siteUrl: this.sites,
        preset: this.selectedPreset,
      },
    });
  }

  onSearchChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchProject = searchTerm;
    this.searchControl.next(searchTerm);
  }
}
