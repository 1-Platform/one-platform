import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResults: SearchResponseType;
  sliceLimit = 10;
  appsStats: any[] = [];
  appsList: any[] = [];
  filteredApps: any[] = [];
  selectedOrder: string;
  sortOrder: string;
  query: string;
  start = 0;
  rows = 10;
  loading = true;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe( params => {
      this.query = params.get( 'query' );
    } );
   }

  async ngOnInit(): Promise<void> {
    await this.search( this.start ).then(() => this.loading = false);
    await this.generateAppFilter();
  }

  search =  (start) => {
    return this.appService.search( this.query, start, this.rows ).then( searchResponse => {
      if ( !this.searchResults ) {
        this.searchResults = searchResponse;
      } else {
        this.searchResults.response.docs = this.searchResults.response.docs.concat( searchResponse.response.docs);
      }
    } );
  }

  generateAppFilter = () => {
    this.appsStats = [];
    this.searchResults?.response?.docs?.map( res => {
      this.appsStats.push( res.content_type );
    } );
    this.appsList = _.map( _.groupBy( this.appsStats ), ( value, key ): any => {
      return {
        content_type: key,
        icon: this.searchResults?.response?.docs?.filter( res => res?.content_type === key )[ 0 ].icon,
        count: value.length,
        selected: false
      };
    } );
  }

  showMore = async () => {
    this.start += this.rows;
    await this.search( this.start ).then( () => this.loading = false );
    this.sliceLimit = this.start + this.rows;
    await this.generateAppFilter();
  }

  selectedContent = () => {
    this.filteredApps = _.compact(this.appsList.map( app => {
      if ( app.selected ) {
        return app.content_type;
      }
    }));
  }

  orderFilter = ( orderType: any ) => {
    if ( this.selectedOrder === orderType ) {
      this.selectedOrder = null;
    }
    this.selectedOrder = orderType;
    if ( this.selectedOrder === 'desc' ) {
      this.sortOrder = '-timestamp';
    } else if ( this.selectedOrder === 'asc' ) {
      this.sortOrder = 'timestamp';
    }
  }
}
