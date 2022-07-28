import { TitleCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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

  pickedColumns = [];
  rows: Row[] = [];
  leaderboardSortDir: Sort[] = ['DESC', 'ASC'];

  @ViewChild('pickSelect') pickSelect: ElementRef;
  isPickSelectOpen = false;
  pickedCategoryList = [
    'PWA',
    'SEO',
    'ACCESSIBILITY',
    'BEST_PRACTICES',
    'PERFORMANCE',
  ];
  pickedCategory: Record<string, boolean> = {};

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
    this.pickedColumns = LEADERBOARD_COLUMNS;
    this.pickedCategory = this.pickedCategoryList.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
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

  /**
   * This is used to check application filter multi-select dropdown closing
   * Reference: https://medium.com/ekohe/dismissing-a-react-dropdown-menu-by-clicking-outside-its-container-7fe9f31a6767
   */
  @HostListener('document:click', ['$event'])
  onDocClick(ev: Event) {
    const pickSelect = this.pickSelect?.nativeElement;
    if (
      pickSelect &&
      !pickSelect.contains(ev.target) &&
      this.isPickSelectOpen
    ) {
      this.onPickedLeaderboardCategoryClose();
    }
  }

  onPickedLeaderboardCategoryToggle() {
    if (this.isPickSelectOpen) {
      this.onPickedLeaderboardCategoryClose();
    } else {
      this.isPickSelectOpen = true;
    }
  }

  onPickedLeaderboardCategoryClose() {
    this.isPickSelectOpen = false;
    const pickedColumns = [];
    LEADERBOARD_COLUMNS.forEach((val) => {
      if (
        !val.key ||
        val.key === LeaderboardCategory.OVERALL ||
        this.pickedCategory[val.key]
      ) {
        pickedColumns.push({ ...val, sortDir: val?.sortDir });
      }
    });
    this.pickedColumns = pickedColumns;
    this.fetchLHLeaderboard();
  }

  onPickedLeaderboardClick(option: string) {
    if (this.pickedCategory?.[option]) {
      const category = { ...this.pickedCategory };
      delete category[option];
      this.pickedCategory = category;
    } else {
      this.pickedCategory[option] = true;
    }
  }

  getAvgScore(scores: number[]) {
    const avg = scores.reduce((prev, curr) => prev + curr, 0) / scores.length;
    return Math.min(Math.max(avg, 0), 100);
  }

  getCategory() {
    return this.pickedColumns.find(
      ({ sortDir, isSortable }) => isSortable && Boolean(sortDir)
    );
  }

  fetchLHLeaderboard(): void {
    this.isPageLoading = true;
    // for sorting
    const selectedCategory = this.getCategory();
    // for removing some parameters from leaderboard like PWA
    const pickedCategory = Object.keys(this.pickedCategory);
    try {
      this.listLeaderBoardSubscription = this.leaderboardService
        .listLHLeaderboard(
          selectedCategory.key,
          selectedCategory.sortDir,
          this.searchTerm,
          this.pageLimit,
          this.pageOffset,
          pickedCategory.length !== 5
            ? (pickedCategory as LeaderboardCategory[])
            : []
        )
        .subscribe(({ data: { listLHLeaderboard }, loading }) => {
          this.isPageLoading = loading;
          this.totalCount = listLHLeaderboard?.count;
          this.rows = listLHLeaderboard?.rows.map((leader) => {
            return {
              cells: getLeaderboardCells({
                row: leader,
                titleCasePipe: this.titleCasePipe,
                pickedCategory: this.pickedCategory,
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
    this.pickedColumns = this.pickedColumns.map(({ sortDir, ...column }) =>
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
