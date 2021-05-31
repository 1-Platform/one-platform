import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppService } from '../app.service';
const Ansi = require( 'ansi-to-html' );
@Component( {
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
} )
export class HomeComponent implements OnInit {
  document: Document | any;
  sites: string | any = '';
  buildToken: string | any = '';
  buildID: string | any = '';
  projectID: string | any = '';
  loading: boolean | any = false;
  showScore: boolean | any = false;
  selectedPreset: string | any = 'lighthouse:recommended';
  presets = [ {
    name: 'All',
    value: 'lighthouse:all'
  }, {
    name: 'Recommended',
    value: 'lighthouse:recommended'
  },
  {
    name: 'No PWA',
    value: 'lighthouse:no-pwa'
  } ];
  auditProgress: string | any = '';
  auditId: string | any;
  convert = new Ansi();
  lhciScores = [ {
    name: 'Performance',
    label: 'performance',
    score: 0,
    class: null,
  }, {
    name: 'Accessibility',
    label: 'accessibility',
    score: 0,
    class: null,
  }, {
    name: 'Best Practices',
    label: 'bestPractices',
    score: 0,
    class: null,
  }, {
    name: 'SEO',
    label: 'seo',
    score: 0,
    class: null,
  }, {
    name: 'PWA',
    label: 'pwa',
    score: 0,
    class: null,
  } ];
  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.updateProgress();
  }

  get user(): any {
    return window.OpAuthHelper.getUserInfo();
  }

  scrollBottom = () => {
    document.querySelector( '#codeBlock' ).scrollTo( 0, document.querySelector( '#codeBlock' ).scrollHeight );
  }

  fetchProjectDetails = () => {
    this.appService.fetchProjectDetails( this.buildToken ).then( response => {
      if ( response.fetchProjectDetails?.token === this.buildToken ) {
        this.projectID = response.fetchProjectDetails?.id;
        window.OpNotification.success( {
          subject: `Valid Token`,
          body: `Token valid for project ${ response.fetchProjectDetails?.name }.`
        } );
      } else {
        this.projectID = null;
        window.OpNotification.warning( {
          subject: `Invalid Token`,
          body: `Build token is invalid.`
        } );
      }
    } );
  }

  updateProgress = () => {
    this.appService.autorun().subscribe( ( progress: string ) => {
      if ( progress.substr(0, this.auditId.length) === this.auditId ) {
        if ( progress.replace( this.auditId, '' ) ) {
          progress = progress.replace( this.auditId, '' );
          if ( progress !== `1` ) {
            if ( progress.match( /Saving CI Build/img ) ) {
              this.buildID = progress.substring( progress.lastIndexOf( 'Saving CI build (' ) + 17, progress.lastIndexOf( ')' ) );
            }
            progress = this.linkParser( progress );
            this.auditProgress += this.convert.toHtml( progress );
          } else {
            this.loading = false;
            this.fetchScore(this.projectID, this.buildID);
            window.OpNotification.success( {
              subject: `Audit completed successfully`
            } );
          }
          this.scrollBottom();
        }
      }
    } );
  }

  linkParser = ( progress ) => {
    const replacePattern1 = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    let replacedText = progress.replace( replacePattern1, '<a href="$1" target="_blank">$1</a>' );
    replacedText = replacedText.replace( replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>' );
    return replacedText;
  }

  auditWebsite = () => {
    this.auditProgress = ``;
    this.loading = true;
    this.showScore = false;
    const property = {
      sites: this.sites,
      serverBaseUrl: environment.LH_SERVER_URL,
      currentBranch: 'spa-master',
      authorName: this.user.fullName,
      authorEmail: this.user.email,
      buildToken: this.buildToken,
      commitMessage: `Benchmark Commit by ${ this.user.fullName } at ${ new Date().toUTCString() }`,
      preset: this.selectedPreset
    };
    this.appService.auditWebsite( property ).subscribe( response => {
      this.auditId = response.auditWebsite;
      window.OpNotification.success( {
        subject: `Audit started successfully`
      } );
    } );
  }

  fetchScore = (projectID, buildID) => {
    this.appService.fetchScore( projectID, buildID ).then( responses => {
      console.log( responses );
      this.showScore = true;
      const scores = responses.reduce( ( acc, val ) => {
        Object.keys( val ).map( ( prop: any ) => {
          if ( acc.hasOwnProperty( prop ) ) { acc[ prop ] += val[ prop ]; }
          else { acc[ prop ] = ( val[ prop ] ); }
        } );
        return acc;
      }, {} );

      this.lhciScores.map( record => {
        Object.keys( scores ).map( key => {
          if ( key === record.label ) {
            record.score = Math.trunc( ( scores[ key ] / responses.length ) * 100 );
            if ( record.score >= 0 && record.score <= 49 ) {
              record.class = 'orange';
            } else if ( record.score >= 50 && record.score <= 89 ) {
              record.class = 'blue';
            } else if ( record.score >= 90 && record.score <= 100 ) {
              record.class = 'green';
            }
            return record;
          }
        } );
      } );
    } );
  }
}
