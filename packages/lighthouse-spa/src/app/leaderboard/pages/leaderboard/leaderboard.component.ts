import { Component, OnInit } from '@angular/core';
import { LeaderboardCategory } from 'app/leaderboard/enum';
import { LeaderboardService } from 'app/leaderboard/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  leaderboardTypes = [
    'PWA',
    'SEO',
    'ACCESSIBILITY',
    'BEST_PRACTICES',
    'PERFORMANCE',
  ] as LeaderboardCategory[];
  leaderboardSortDir: Sort[] = ['DESC', 'ASC'];

  lighthouseLeaderboard: LHLeaderboard[] = [];

  leaderbooardSelectedCategory = LeaderboardCategory.PWA;
  leaderboardSelectedSortOrder: Sort = 'DESC';

  // pagination
  totalCount = 0;
  pageOffset = 0;
  pageLimit = 10;
  pageLimitOptions = [5, 10, 20, 50];

  isPageLoading = true;
  isPageLimitOptionOpen = false;
  isPageSortOptionOpen = false;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.fetchLHLeaderboard();
  }

  fetchLHLeaderboard() {
    this.isPageLoading = true;

    try {
      this.leaderboardService
        .listLHLeaderboard(
          this.leaderbooardSelectedCategory,
          this.leaderboardSelectedSortOrder,
          this.pageLimit,
          this.pageOffset
        )
        .valueChanges.subscribe(({ data: { listLHLeaderboard }, loading }) => {
          this.isPageLoading = loading;
          this.totalCount = listLHLeaderboard.count;
          this.lighthouseLeaderboard = listLHLeaderboard.rows;
        });
    } catch (error) {
      window.OpNotification.danger({
        subject: 'Error on loading leaderboard',
        body: error.message,
      });
    }
  }

  handleLeaderboardOptionChange(type: LeaderboardCategory) {
    if (!this.isPageLoading) {
      this.pageOffset = 0;
      this.leaderbooardSelectedCategory = type;
      this.fetchLHLeaderboard();
    }
  }

  handleToggleOption() {
    this.isPageLimitOptionOpen = !this.isPageLimitOptionOpen;
  }

  handleToggleSortOption() {
    this.isPageSortOptionOpen = !this.isPageSortOptionOpen;
  }

  handlePageLimitChange(limit: number) {
    this.pageLimit = limit;
    this.pageOffset = 0;
    this.fetchLHLeaderboard();
    this.handleToggleOption();
  }

  handleNextPageClick() {
    this.pageOffset += this.pageLimit;
    this.fetchLHLeaderboard();
  }

  handlePrevPageClick() {
    this.pageOffset -= this.pageLimit;
    this.fetchLHLeaderboard();
  }

  handleSortDirChange(dir: Sort) {
    this.pageOffset = 0;
    this.leaderboardSelectedSortOrder = dir;
    this.fetchLHLeaderboard();
    this.handleToggleSortOption();
  }
}
