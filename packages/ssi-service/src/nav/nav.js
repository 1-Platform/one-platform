import { LitElement, html, css, unsafeCSS } from 'lit-element';
import moment from 'moment';
import gql from 'graphql-tag';
import PfeToast from '@patternfly/pfe-toast';
import styles from './nav.css';
import './auth';
import { OpAuthHelper } from './auth';
import APIHelper from './api';

/* TODO: Check if user is already authenticated before re-initializing */
OpAuthHelper.init();

const ASSETS_URL = process.env.ASSETS_HOST + '/assets';

window.customElements.define( 'op-nav', class extends LitElement {
  static get properties () {
    return {
      drawerOpen: { type: Boolean },
      _appsList: { type: Array, attribute: false },
      _notificationsList: { type: Array, attribute: false },
      _userDetails: { type: Object, attribute: false },
      activeDrawerType: { type: String, attribute: false },
    };
  }
  static get styles () {
    return css`${ unsafeCSS( styles ) }`;
  }

  constructor () {
    super();

    /* Initializing the drawer element */
    this.drawer = document.createElement( 'dialog' );
    this.drawer.id = 'op-menu-drawer';
    this.drawer.classList.add( 'op-menu-drawer' );
    this.drawer.setAttribute( 'role', 'dialog' );
    this.drawer.setAttribute( 'aria-modal', true );

    this._appsList = [];
    this._notificationsList = [];
    this._userDetails = null;
    this._toastNotificationsList = [];

    this.activeDrawerType = '';
    this.drawerOpen = false;

    this._notificationsSubscription = null;

    OpAuthHelper.onLogin( user => {
      this._userDetails = user;

      APIHelper.navDrawerData([])
        .then( res => {
          this._appsList = res.appsList.sort( ( prev, next ) => {
            if ( prev.name?.toLowerCase() <= next.name?.toLowerCase() ) {
              return -1;
            } else {
              return 1;
            }
          } );
          this._notificationsList = res.notificationsList;
        } )
        .catch( err => {
          console.error( err );
        } );

      if ( this._notificationsSubscription ) {
        this._notificationsSubscription.unsubscribe();
      }
      this._notificationsSubscription = APIHelper.apollo
        .subscribe( {
          query: gql`subscription Notifications($targets: [String!]!) {
            notification: newNotifications(target: $targets) {
              id
              title
              body
              link
              data
              type
              sentOn
            }
          }`,
          variables: {
            targets: [
              user.kerberosID,
              user.email,
              ...( user.realm_access?.roles ? user.realm_access.roles: []),
            ],
          }
        } )
        .subscribe( res => {
          if ( res.errors ) {
            throw res.errors;
          }
          this.showToast( res.data.notification, { addToDrawer: true } );
        } );
    } );

    /* Exporting the OpNotification as a helper function */
    window.OpNotification = {
      showToast: this.showToast.bind(this),
    };
    /* MAGIC: Aliases for different toast variants */
    [ 'success', 'warning', 'danger', 'info' ].forEach( variant => {
      window.OpNotification[ variant ] = ( ...args ) => {
        if ( args.length > 1 ) {
          args[ 1 ][ 'variant' ] = variant;
        } else {
          args.push( { variant } );
        }
        this.showToast( ...args );
      }
    });
  }

  disconnectedCallback () {
    if ( this._notificationsSubscription && !this._notificationsSubscription.closed ) {
      this._notificationsSubscription.unsubscribe();
    }
  }

  /**
   * Opens or closes the drawer
   *
   * @param {'app' | 'notification' | 'user'} drawerType
   */
  toggleDrawer ( drawerType ) {
    if ( !drawerType ) {
      return;
    }

    if ( this.drawerOpen && drawerType === this.activeDrawerType ) {
      this.drawerOpen = false;
      this.activeDrawerType = null;
      return;
    }

    this.drawerOpen = true;
    this.activeDrawerType = drawerType;
  }
  _handleDrawerToggle ( event ) {
    if ( event.target?.dataset?.type ) {
      this.toggleDrawer( event.target.dataset.type );
    }
  }

  /**
   * Shows a toast/pop-up notification
   *
   * @param {{ subject, body, sentOn, link }} notification Toast Contents
   * @param {{ addToDrawer: boolean, duration: string, variant: 'success' | 'warning' | 'danger' | 'info' }} options Toast Options
   */
  showToast ( notification, options ) {
    if ( !notification.sentOn ) {
      notification.sentOn = moment().toISOString();
    }
    options = Object.assign( { addToDrawer: false, duration: '5s' }, options );

    const toast = new PfeToast();
    toast.setAttribute( 'auto-dismiss', options.duration );
    toast.classList.add( 'op-menu-drawer__notification-toast' );
    if ( options.variant && options.variant ) {
      toast.classList.add( `op-toast__${options.variant}` );
    }

    const toastContent = document.createElement( 'template' );
    toastContent.innerHTML = `
      <span class="op-menu-drawer__notification-time" title="${moment( notification.sentOn ).format( 'LLL' ) }">just now</span>
      <h5 class="op-menu-drawer__notification-subject">
        ${ notification.link ? `<a href="${ notification.link }">${ notification.subject }</a>` : notification.subject }
      </h5>
      <p style="display: ${ !!notification.body ? 'block': 'none' };" class="op-menu-drawer__notification-body">${ notification.body }</p>
    `;

    toast.appendChild( toastContent.content.cloneNode( true ) );
    this.shadowRoot.getElementById( 'op-menu__toast-container' ).appendChild( toast );
    toast.open();
    this._addToastToList( toast );

    toast.addEventListener( 'pfe-toast:close', event => {
      this._toastNotificationsList = this._toastNotificationsList.filter( t => t.classList.contains( 'open' ) );
      event.target.remove();
    } );

    if ( options.addToDrawer ) {
      this._notificationsList.push( notification );
    }
  }
  _addToastToList ( newToast ) {
    this._toastNotificationsList.unshift( newToast );

    /* Dismiss excess notifications */
    if ( this._toastNotificationsList.length > 4 ) {
      this._toastNotificationsList.slice( 5 ).map( toast => {
        toast.close();
      } );
    }
  }

  get _drawerContents () {
    if ( !this.drawerOpen ) {
      return '';
    }
    switch ( this.activeDrawerType ) {
      case 'app':
        return this._appDrawer;
      case 'notification':
        return this._notificationDrawer;
      case 'user':
        return this._userDrawer;
      default:
        return html`<p>There was some error. Try selecting an option again.`;
    }
  }

  get _appDrawer () {
    if ( this._appsList.length === 0 ) {
      return html`<div class="op-menu-drawer__empty-state">
        <p>No Apps found. Please try reloading the page.</p>
      </div>`;
    }

    return html`<ul class="op-menu-drawer__app-list">
      ${this._appsList.map( app => ( html`
        <li class="op-menu-drawer__app-list-item ${ app.active ? '' : 'inactive' }">
          <a .href="${ app.link }">
            <div>
              <img .src="${ app.icon || ASSETS_URL + '/rh-hat-logo.svg' }"/>
            </div>
            <span>
              ${ app.name }
            </span>
          </a>
        </li>
      `) ) }
      `;
  }

  get _notificationDrawer () {
    return html`
      <h3 class="op-menu-drawer__title">All Notifications <span class="op-menu-drawer__notifications-count" style="visibility: ${this._notificationsList.length === 0 ? 'hidden' : 'visible' }">${ this._notificationsList.length }</span></h3>

      ${ this._notificationsList.length === 0
        ? html`<div class="op-menu-drawer__empty-state">
            <p>No Notifications available at the moment.</p>
            </div>`

        : html`<ul class="op-menu-drawer__notifications-list">
            ${this._notificationsList.map( notification => ( html`
              <li class="op-menu-drawer__notification-item">
                <span class="op-menu-drawer__notification-time" title="${moment( notification.sentOn ).format( 'LLL' ) }">${ moment( notification.sentOn ).fromNow() }</span>
                <h5 class="op-menu-drawer__notification-subject">
                  <a href="${ notification.link }">${ notification.subject }</a>
                </h5>
                <p class="op-menu-drawer__notification-body">${notification.body }</p>
              </li>`) ) }
          </ul>`
      }
    `;
  }

  get _userDrawer () {
    if ( !this._userDetails ) {
      return html`<p style="text-align: center;">There was some error fetching your details. Try reloading the page.</p>`;
    }

    return html`
      <figure class="op-user-profile-icon">
        <ion-icon name="person" size="large"></ion-icon>
      </figure>
      <h3 class="op-menu-drawer__title">${ this._userDetails?.fullName }</h3>
      <p>${ this._userDetails?.title }</p>
      <a href="/user" class="op-user-profile-btn">View Profile</a>
      <button type="button" class="op-user-signout-btn">Sign Out</button>
    `;
  }

  render () {
    return html`
      <header class="op-nav">
        <div class="op-nav-wrapper">
          <!-- QSTN: Customizable menu here?? -->
          <a class="op-logo" href="/">
            <img class="op-logo__img" .src="${ ASSETS_URL }/rh-op-logo.svg" alt="Red Hat One Portal">
          </a>

          <form class="op-search" onsubmit="return false" disabled>
            <input type="search" name="q" autocomplete="off" aria-label="Search for Applications, Documents or any content" class="op-search-bar__input" placeholder="Search for Applications, Documents or any content" required disabled readonly>
            <button class="op-search__btn" type="submit">
              <ion-icon name="search-outline" class="op-nav__icon"></ion-icon>
            </button>
          </form>

          <nav class="op-menu">
            <ul class="op-menu-wrapper">
              <li class="op-menu__item">
                <button type="button"
                  class="op-menu__item-button"
                  data-type="app"
                  ?data-active="${this.activeDrawerType === 'app' }"
                  @click="${ this._handleDrawerToggle }">
                  <ion-icon name="apps-outline" class="op-nav__icon"></ion-icon>
                  <span>Apps</span>
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button"
                  class="op-menu__item-button"
                  data-type="notification"
                  ?data-active="${this.activeDrawerType === 'notification' }"
                  @click="${ this._handleDrawerToggle }">
                  <ion-icon name="notifications-outline" class="op-nav__icon"></ion-icon>
                  <span class="op-nav__item-dot" ?disabled="${this._notificationsList.length === 0}"></span>
                  <span>Notifications</span>
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button"
                  class="op-menu__item-button"
                  data-type="user"
                  ?data-active="${this.activeDrawerType === 'user' }"
                  @click="${ this._handleDrawerToggle }">
                  <ion-icon name="person-outline" class="op-nav__icon"></ion-icon>
                  <span>${this._userDetails?.kerberosID || 'Sign In' }</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <dialog id="op-menu-drawer"
        class="op-menu-drawer"
        role="dialog"
        aria-modal="true"
        ?open="${ this.drawerOpen }"
        data-type="${ this.activeDrawerType }">
          ${ this._drawerContents }
      </dialog>

      <div id="op-menu__toast-container" class="op-menu__toast-container"></div>
    `;
  }
} );
