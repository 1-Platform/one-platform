import { TitleCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeaderboardCategory } from 'app/leaderboard/enum';
import { LeaderboardService } from 'app/leaderboard/leaderboard.service';
import { Row } from 'app/shared/components/table/table.component';
import {
  getLeaderboardCells,
  LEADERBOARD_COLUMNS,
} from 'app/utils/leaderboardTable';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
    'OVERALL',
  ] as LeaderboardCategory[];
  columns = LEADERBOARD_COLUMNS;
  rows: Row[] = [];
  leaderboardSortDir: Sort[] = ['DESC', 'ASC'];

  @ViewChild('search') searchInput: ElementRef;
  searchSubscription: Subscription;
  searchTerm = '';

  listLeaderBoardSubscription: Subscription;

  // pagination
  totalCount = 0;
  pageOffset = 0;
  pageLimit = 10;
  pageLimitOptions = [5, 10, 20, 50];

  isPageLoading = true;
  isPageLimitOptionOpen = false;
  isPageSortOptionOpen = false;

  constructor(
    private leaderboardService: LeaderboardService,
    private titleCasePipe: TitleCasePipe
  ) {}

  ngOnInit(): void {
    this.fetchLHLeaderboard();
  }

  ngOnDestroy(): void {
    this.listLeaderBoardSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: InputEvent) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((search) => {
        this.searchTerm = search;
        this.pageOffset = 0;
        this.fetchLHLeaderboard();
      });
  }

  getAvgScore(scores: number[]) {
    const avg = scores.reduce((prev, curr) => prev + curr, 0) / scores.length;
    return Math.min(Math.max(avg, 0), 100);
  }

  getCategory() {
    return this.columns.find(
      ({ sortDir, isSortable }) => isSortable && Boolean(sortDir)
    );
  }

  fetchLHLeaderboard(): void {
    this.isPageLoading = true;
    const selectedCategory = this.getCategory();
    try {
      this.listLeaderBoardSubscription = this.leaderboardService
        .listLHLeaderboard(
          selectedCategory.key,
          selectedCategory.sortDir,
          this.searchTerm,
          this.pageLimit,
          this.pageOffset
        )
        .subscribe(({ data: { listLHLeaderboard }, loading }) => {
          this.isPageLoading = loading;
          this.totalCount = listLHLeaderboard?.count;
          this.rows = listLHLeaderboard?.rows.map((leader) => {
            return {
              cells: getLeaderboardCells({
                row: leader,
                titleCasePipe: this.titleCasePipe,
              }),
            };
          });
        });
    } catch (error) {
      console.error(error);
      window.OpNotification.danger({
        subject: 'Error on loading leaderboard',
        body: error.message,
      });
    }
  }

  handleSortClick({
    column: columnName,
    sortDir: dir,
  }: {
    column: string;
    sortDir: 'DESC' | 'ASC';
  }) {
    this.pageOffset = 0;
    this.columns = this.columns.map(({ sortDir, ...column }) =>
      column.title === columnName ? { ...column, sortDir: dir } : column
    );
    this.fetchLHLeaderboard();
  }

  handleToggleOption(): void {
    this.isPageLimitOptionOpen = !this.isPageLimitOptionOpen;
  }

  handlePageLimitChange(limit: number): void {
    this.pageLimit = limit;
    this.pageOffset = 0;
    this.fetchLHLeaderboard();
    this.handleToggleOption();
  }

  handleNextPageClick(): void {
    this.pageOffset += this.pageLimit;
    this.fetchLHLeaderboard();
  }

  handlePrevPageClick(): void {
    this.pageOffset -= this.pageLimit;
    this.fetchLHLeaderboard();
  }
}
