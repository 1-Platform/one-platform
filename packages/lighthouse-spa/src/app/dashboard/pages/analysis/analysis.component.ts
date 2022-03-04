import { TitleCasePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Row } from 'app/shared/components/table/table.component';
import {
  getLeaderboardCells,
  LEADERBOARD_COLUMNS,
} from 'app/utils/leaderboardTable';
import { Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent implements OnInit {
  projectId = '';
  branches: string[] = [];
  buildScores: Record<string, ProjectBranch[]> = {};

  selectedBranch = '';

  title = '';
  isPageLoading = true;
  isBranchLoading = true;

  // context selector options
  isBranchContextSelectorOpen = false;
  branchContextSelectorSearchValue = '';

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

  destroySub: Subject<boolean> = new Subject<boolean>();

  // leaderboard states
  isLeaderboardLoading = true;
  rows: Row[] = [];
  columns = LEADERBOARD_COLUMNS;

  externalLHServerURL = '#';

  constructor(
    private router: ActivatedRoute,
    private dashboardService: DashboardService,
    private titleCasePipe: TitleCasePipe,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    this.router.queryParams
      .pipe(takeUntil(this.destroySub))
      .subscribe((params) => {
        this.title = params.name as string;
      });
    // setting debounce subscription

    this.router.params.pipe(takeUntil(this.destroySub)).subscribe((params) => {
      this.projectId = params.id;
      try {
        this.dashboardService
          .listLHProjectBranches(this.projectId)
          .valueChanges.pipe(takeUntil(this.destroySub))
          .subscribe(({ data }) => {
            const { rows } = data.listLHProjectBranches;
            this.branches = this.handlePriorityOrderBranch(rows);
            this.isPageLoading = false;
            if (this.branches.length > 0) {
              this.selectedBranch = this.branches[0];
              this.fetchBranchScore(this.branches[0]);
            }
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
    this.destroySub.next(true);
    this.destroySub.unsubscribe();
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

  async fetchBranchScore(branch: string) {
    // to avoid error on dynamic query builder
    this.isLeaderboardLoading = true;
    try {
      this.externalLHServerURL = `${environment.LH_SERVER_URL}/app/projects/${this.title}/dashboard?branch=${branch}`;
      if (!this.buildScores?.[branch]) {
        this.isBranchLoading = true;
        this.dashboardService
          .ListLHProjectScores(this.projectId, branch)
          .pipe(takeUntil(this.destroySub))
          .subscribe(({ data }) => {
            this.isBranchLoading = false;
            this.buildScores = {
              ...this.buildScores,
              [branch]: data.listLHProjectBuilds,
            };
          });
      }
      this.fetchLHLeaderboard();
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Error on fetching scores',
        body: error.message,
      });
    }
  }

  // context selector functions
  onToggleBranchSelector(isOpen: boolean): void {
    this.isBranchContextSelectorOpen = isOpen;
  }

  onBranchSelectorSearchChange(searchValue: string): void {
    this.branchContextSelectorSearchValue = searchValue;
  }

  onBranchSelect(branch: string): void {
    this.selectedBranch = branch;
    this.isBranchContextSelectorOpen = false;
    this.branchContextSelectorSearchValue = '';
    this.fetchBranchScore(branch);
  }

  // leaderboard functions
  fetchLHLeaderboard(): void {
    this.isLeaderboardLoading = true;
    const selectedCategory = this.getCategory();
    try {
      this.dashboardService
        .listLHLeaderboard(
          selectedCategory.key,
          this.selectedBranch,
          this.projectId,
          selectedCategory.sortDir
        )
        .subscribe(
          ({
            data: {
              listLHLeaderboard,
              getLHRankingOfAProjectBranch: currentBranchRank,
            },
            loading,
          }) => {
            this.isLeaderboardLoading = loading;
            const leaders = [...listLHLeaderboard.rows];
            // obtain the new leaderboard with the selected branch rank
            const [finalLeaderboard, pos] =
              this.joinCurrentBranchScoreToLeaderBoard(
                currentBranchRank,
                leaders
              );

            this.rows = finalLeaderboard.map((leader, index) => {
              const isSelected = index === pos;

              return {
                rowClassName: isSelected ? 'selected-row' : '',
                cells: getLeaderboardCells({
                  row: leader,
                  titleCasePipe: this.titleCasePipe,
                  isSelected,
                }),
              };
            });
          }
        );
    } catch (error) {
      console.error(error);
      window.OpNotification.danger({
        subject: 'Error on loading leaderboard',
        body: error.message,
      });
    }
  }

  joinCurrentBranchScoreToLeaderBoard(
    currentBranchRank: LHLeaderboard,
    leaders: LHLeaderboard[]
  ): [LHLeaderboard[], number] {
    let pos = leaders.length;
    for (let i = 0; i < leaders.length; i++) {
      // check current one is in leaderboard
      if (
        currentBranchRank.branch === leaders[i].branch &&
        currentBranchRank.project.id === leaders[i].project.id
      ) {
        return [leaders, i];
      }
      // else place in correct rank position
      if (currentBranchRank.rank <= leaders[i].rank) {
        pos = i;
      }
    }
    leaders.splice(pos, 0, currentBranchRank);
    return [leaders, pos];
  }

  getCategory() {
    return this.columns.find(
      ({ sortDir, isSortable }) => isSortable && Boolean(sortDir)
    );
  }

  handleSortClick({ column: columnName }) {
    this.columns = this.columns.map(({ sortDir, ...column }) =>
      column.title === columnName ? { ...column, sortDir: 'DESC' } : column
    );
    this.fetchLHLeaderboard();
  }
}
