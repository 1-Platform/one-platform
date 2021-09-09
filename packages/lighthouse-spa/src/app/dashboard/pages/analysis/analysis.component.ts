import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  projectId = '';
  apps: { branch: string; data: ProjectBranch[] }[] = [];
  branches: string[] = [];

  search = ''; // input search state
  searchControl: Subject<string> = new Subject<string>(); // search input debounce

  // pagination states
  BRANCHES_LOADED = 5;
  isNextPageLoading = false;

  title = '';
  isPageLoading = true;

  // timeline chart options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  yAxisLabel = 'Score';
  xAxisLabel = 'Time';
  showXAxisLabel: boolean = true;
  showRefLines: boolean = true;
  timeline: boolean = true;
  yScaleMin = 0;
  yScaleMax = 100;
  legendTitle = 'Scores';
  referenceLines = [
    {
      name: 'best',
      value: '90',
    },
  ];
  timelineColorSchema = {
    domain: ['#0066CC', '#EE0000', '#3E8635', '#F0AB00', '#151515'],
  } as any;

  constructor(
    private router: ActivatedRoute,
    private dashboardService: DashboardService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      this.title = params.name as string;
    });
    // setting debounce subscription
    this.searchControl
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe({
        next: (searchTerm: string) =>
          this.handleDebounceSearchCallback(searchTerm),
      });

    this.router.params.subscribe((params) => {
      this.projectId = params.id;
      try {
        this.dashboardService
          .listLHProjectBranches(this.projectId)
          .valueChanges.subscribe(({ data }) => {
            const { rows } = data.listLHProjectBranches;
            this.branches = this.handlePriorityOrderBranch(rows);

            this.fetchBranchScore(this.initialSetBranches);
          });
      } catch (error) {
        window.OpNotification.danger({
          subject: 'Error on fetching branches',
          body: error.message,
        });
      }
    });
  }

  ngOnDestroy() {
    // cleaning up subscriptions
    this.searchControl.unsubscribe();
  }

  get isSearchEmpty() {
    return Boolean(this.search);
  }

  get initialSetBranches() {
    return this.branches.slice(0, this.BRANCHES_LOADED);
  }

  /**
   * A function to reorder the fetched branch list
   * with master or main at front
   */
  handlePriorityOrderBranch(
    branches: {
      branch: string;
    }[]
  ) {
    const priorityBranch = [];
    branches.forEach(({ branch }) =>
      branch === 'master' || branch === 'main'
        ? priorityBranch.unshift(branch)
        : priorityBranch.push(branch)
    );
    return priorityBranch;
  }

  async fetchBranchScore(branches: string[]) {
    // to avoid error on dynamic query builder
    if (branches.length === 0) {
      this.apps = [];
      this.isPageLoading = false;
      this.isNextPageLoading = false;
      return;
    }
    try {
      this.dashboardService
        .ListLHProjectScores(this.projectId, branches)
        .valueChanges.subscribe(({ data, loading }) => {
          const fetchedBranchData = branches.map((branch, index) => ({
            branch,
            data: data[`branch${index}`],
          }));
          this.apps = [...this.apps, ...fetchedBranchData];
          this.isPageLoading = loading;
          this.isNextPageLoading = loading;
        });
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Error on fetching scores',
        body: error.message,
      });
    }
  }

  handleDebounceSearchCallback(searchTerm: string) {
    this.isPageLoading = true;
    this.apps = [];
    if (this.isSearchEmpty) {
      // on search we fetch top 5 results only
      const results = this.branches
        .filter((branch) => branch.includes(searchTerm))
        .slice(0, 5);
      this.fetchBranchScore(results);
    } else {
      this.fetchBranchScore(this.initialSetBranches);
    }
  }

  onScroll() {
    const presentIndex = this.apps.length;
    const totalBranches = this.branches.length;
    if (totalBranches > presentIndex && !this.isSearchEmpty) {
      this.isNextPageLoading = true;
      try {
        this.fetchBranchScore(
          this.branches.slice(
            presentIndex,
            presentIndex + this.BRANCHES_LOADED - 1
          )
        );
      } catch (error) {
        window.OpNotification.danger({
          subject: 'Error on fetching scores',
          body: error.message,
        });
      }
    }
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.search = searchTerm;
    // propagate input change to get debounced result
    this.searchControl.next(searchTerm);
  }
}
