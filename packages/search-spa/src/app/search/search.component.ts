import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { AppService } from 'src/app/app.service';
import { pagination } from '../utils/pagination';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults: SearchResponseType;
  appsStats: any[] = [];
  appsList: any[] = [];
  filteredApps: any[] = [];
  sortOrder: string;
  query: string;
  loading = true;
  responseTime: string;
  selectedOrderName = 'Sort';
  sortList = [
    {
      name: 'Newest First',
      filter: 'desc',
    },
    {
      name: 'Oldest First',
      filter: 'asc',
    },
  ];
  topPaginationOptionsActive = false;
  bottomPaginationOptionsActive = false;
  perPageOptions = [10, 20, 50, 100];
  perPageOption = 10;
  activePage = 1;
  startIndex = 1;
  endIndex = 1;
  totalPages = 0;
  start = 0;
  totalRecordCount = 10;
  relatedApps = [
    {
      name: 'Feedback',
      url: '/feedback',
    },
    {
      name: 'Developer Console',
      url: '/console',
    },
  ];

  constructor(private appService: AppService, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((params) => {
      this.query = params.get('query');
    });
  }

  async ngOnInit(): Promise<void> {
    this.setPagination(
      this.query,
      this.activePage,
      this.start,
      this.perPageOption
    );
  }

  search = (query: string, start: number, perPageOption: number) => {
    const startTime = new Date().getTime();
    return this.appService
      .search(query, start, perPageOption)
      .then((searchResponse) => {
        this.responseTime =
          ((new Date().getTime() - startTime) / 1000).toFixed(2) + ' Seconds';
        this.searchResults = searchResponse;
        this.totalRecordCount = this.searchResults.response.numFound;
      });
  };

  setPagination = async (
    query,
    activePage,
    start,
    perPageOption
  ): Promise<void> => {
    await this.search(query, start, perPageOption).then(
      () => (this.loading = false)
    );
    const paginationOpt = pagination(
      this.totalRecordCount,
      this.activePage,
      this.perPageOption
    );
    this.activePage = paginationOpt.currentPage;
    this.totalPages = paginationOpt.totalPages;
    this.start = paginationOpt.startIndex;
    this.startIndex = paginationOpt.startIndex + 1;
    this.endIndex = paginationOpt.endIndex + 1;

    await this.generateAppFilter();
  };

  setPage = (action) => {
    if (action === 'add') {
      this.activePage += 1;
    } else if (action === 'subtract') {
      this.activePage -= 1;
    }
    this.setPagination(
      this.query,
      this.activePage,
      this.start,
      this.perPageOption
    );
  };

  generateAppFilter = (): void => {
    this.appsStats = [];
    this.searchResults?.response?.docs?.map((res) => {
      this.appsStats.push(res.content_type);
    });
    this.appsList = map(groupBy(this.appsStats), (value, key): any => {
      return {
        content_type: key,
        icon: this.searchResults?.response?.docs?.filter(
          (res) => res?.content_type === key
        )[0].icon,
        count: value.length,
        selected: false,
      };
    });
    this.filteredApps = [];
  };

  selectedApps = (): void => {
    this.filteredApps = compact(
      this.appsList.map((app) => {
        if (app.selected) {
          return app.content_type;
        }
      })
    );
  };

  orderFilter = (orderType: string, orderName: string): void => {
    this.selectedOrderName = orderName;
    if (orderType === 'desc') {
      this.sortOrder = '-createdDate';
    } else if (orderType === 'asc') {
      this.sortOrder = 'createdDate';
    }
  };

  openFeedbackPanel = (): void => {
    (document as any).querySelector('opc-feedback').toggle();
  };
}
