import html from 'html-template-tag';
import styles from './nav.css';
import APIHelper from './api';

/* Initializing the Auth */
import './auth';
/* Initialize SSO Auth as soon as the component is created */
window.OpAuthHelper.init();

const ASSETS_URL = process.env.ASSETS_HOST + '/assets';

window.customElements.define( 'op-nav', class extends HTMLElement {
  constructor () {
    super();

    /* Initializing the drawer element */
    this.drawer = document.createElement( 'dialog' );
    this.drawer.id = 'op-menu-drawer';
    this.drawer.classList.add( 'op-menu-drawer' );
    this.drawer.setAttribute( 'role', 'dialog' );
    this.drawer.setAttribute( 'aria-modal', true );

    this.appsList = [];
  }

  connectedCallback () {
    if ( !this.shadowRoot ) {
      this.attachShadow( { mode: 'open' } );
      this.shadowRoot.appendChild( this._template.content.cloneNode( true ) );

      /* Adding click event listeners */
      this.shadowRoot.querySelectorAll( '.op-menu__item-button' ).forEach( button => {
        button.addEventListener( 'click', event => {
          if ( event.target.dataset ) {
            this.toggleDrawer( event.target.dataset.type );
          }
        } );
      } );

      const styleTag = document.createElement( 'style' );
      styleTag.innerText = styles;
      this.shadowRoot.prepend( styleTag );

      /* If logged in, set the user name */
      window.OpAuthHelper.onLogin( ( user ) => {
        this.shadowRoot.querySelector( '#user-profile > span' ).textContent = user?.kerberosID || 'Sign Out';
        if ( this._isDrawerOpenOfType( 'user' ) ) {
          this.toggleDrawer( 'user', true );
        }

        APIHelper.listApps()
          .then( res => {
            this.appsList = res;
          } )
          .catch( err => {
            this.appsList = [];
            console.error( err );
          } );
      } );
    }
  }

  /**
   * Checks if the drawer is open or not
   */
  get isDrawerOpen () {
    return !!this.shadowRoot.getElementById( 'op-menu-drawer' );
  }
  /**
   * Returns true if the drawer of the given type is open.
   *
   * @param {'app' | 'notification' | 'user'} type
   */
  _isDrawerOpenOfType ( type ) {
    const drawerInDOM = this.shadowRoot.getElementById( 'op-menu-drawer' );
    return !!drawerInDOM && drawerInDOM.dataset.type === type;
  }

  /**
   * Refreshes the active status of the nav menu items
   */
  _refreshActiveButtonStatus () {
    this.shadowRoot.querySelectorAll( '.op-menu__item-button' ).forEach( button => {
      button.classList.remove( 'active' );
      if ( this._isDrawerOpenOfType( button.dataset.type ) ) {
        button.classList.add( 'active' );
      }
    } );
  }

  /**
   * Toggles the open/close state of Drawer.
   *
   * And sets the inner content of the drawer according to the drawer type.
   *
   * @param {"app" | "notification" | "user"} drawerType
   * @param {boolean} refreshInPlace
   */
  toggleDrawer ( drawerType, refreshInPlace = false ) {
    if ( !drawerType ) {
      return;
    }

    if ( !refreshInPlace && this.isDrawerOpen && this.drawer.dataset.type === drawerType ) {
      this.drawer.open = false;
      this.shadowRoot.getElementById( 'op-menu-drawer' ).remove();
      this._refreshActiveButtonStatus();
      return;
    }

    this.drawer.dataset.type = drawerType;
    this.drawer.open = true;

    switch ( drawerType ) {
      case 'app':
        this.drawer.innerHTML = this._appDrawer;
        break;
      case 'notification':
        this.drawer.innerHTML = this._notificationDrawer;
        break;
      case 'user':
        this.drawer.innerHTML = this._userDrawer;
        break;
      default:
        this.drawer.innerHTML = html`<p>There was some error. Try selecting an option again.</p>`;
    }

    const template = document.createElement( 'template' );
    template.innerHTML = this.drawer.outerHTML;

    if ( this.isDrawerOpen ) {
      this.shadowRoot.getElementById( 'op-menu-drawer' ).replaceWith( template.content.cloneNode( true ) );
    } else {
      this.shadowRoot.appendChild( template.content.cloneNode( true ) );
    }

    this._setAppDrawerEventListeners( drawerType );
    this._refreshActiveButtonStatus();
  }

  /**
   * Sets up the event listeners to the appropriate drawer elements when the drawer loads
   *
   * @param {"app" | "notification" | "user"} drawerType
   */
  _setAppDrawerEventListeners ( drawerType ) {
    switch ( drawerType ) {
      case 'user':
        const signoutBtn = this.shadowRoot.getElementById( 'op-user-signout-btn' );
        if ( signoutBtn ) {
          signoutBtn.addEventListener( 'click', () => {
            window.OpAuthHelper.logout();
          } );
        }
        break;
      case 'notification':
        // TODO: add event listeners for the Notifications (for close/dismiss)
        break;
    }
  }

  //#region HTML Templates
  /**
   * Returns a <template> tag for the nav header
   */
  get _template () {
    const template = document.createElement( 'template' );
    template.innerHTML = this._html;

    return template;
  }

  /**
   * Returns the html for the App Drawer
   */
  get _appDrawer () {
    if ( this.appsList.length === 0 ) {
      return html`<div class="op-menu-drawer__empty-state">
        <p>No Apps found. Please try reloading the page.</p>
      </div>`;
    }

    return html`<ul class="op-menu-drawer__app-list">`
      + this.appsList.map( app => this._appDrawerItem( app ) ).join( '' )
      + html`</ul>`;
  }
  /**
   * Returns the html for a cell in the App Drawer List
   *
   * @param {{ name: string, url: string, logo: string }} item
   */
  _appDrawerItem ( item ) {
    return html`
      <li class="op-menu-drawer__app-list-item">
        <a href="${ item.link }">
          <img src="${item.logo || '${ASSETS_URL}/rh-hat-logo.svg' }"/>
          <h5>
            ${ item.name }
          </h5>
        </a>
      </li>
    `;
  }

  /**
   * Returns the html for the Notifications Drawer
   */
  get _notificationDrawer () {
    return html`<h3 class="op-menu-drawer__title">Notifications</h3>`;
  }

  /**
   * Returns the html for the User Profile Drawer
   */
  get _userDrawer () {
    const userDetails = window.OpAuthHelper.getUserInfo();
    if ( !userDetails ) {
      return html`
        <p style="text-align: center;">There was some error fetching your details. Try reloading the page.</p>
      `;
    }
    return html`
      <figure class="op-user-profile-icon">
        <ion-icon name="person" size="large"></ion-icon>
      </figure>
      <h3 class="op-menu-drawer__title">${ userDetails?.fullName }</h3>
      <p>${ userDetails?.title }</p>
      <button id="op-user-signout-btn" type="button" class="op-user-signout-btn">Sign Out</button>
    `;
  }

  /**
   * Returns the html for the nav/header
   */
  get _html () {
    return html`
      <header class="op-nav">
        <div class="op-nav-wrapper">
          <!-- QSTN: Customizable menu here?? -->
          <a class="op-logo" href="/">
            <img class="op-logo__img" src="${ASSETS_URL }/rh-op-logo.svg" alt="Red Hat One Portal">
          </a>

          <form class="op-search">
            <input type="search" name="q" autocomplete="off" aria-label="Search for Applications, Documents or any content" class="op-search-bar__input" placeholder="Search for Applications, Documents or any content" required disabled readonly>
            <button class="op-search__btn" type="submit">
              <ion-icon name="search-outline" class="op-nav__icon"></ion-icon>
            </button>
          </form>

          <nav class="op-menu">
            <ul class="op-menu-wrapper">
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button" data-type="app">
                  <ion-icon name="apps-outline" class="op-nav__icon"></ion-icon>
                  <span>Apps</span>
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button" data-type="notification">
                  <ion-icon name="notifications-outline" class="op-nav__icon"></ion-icon>
                  <span>Notifications</span>
                </button>
              </li>
              <li class="op-menu__item">
                <button id="user-profile" type="button" class="op-menu__item-button" data-type="user">
                  <ion-icon name="person-outline" class="op-nav__icon"></ion-icon>
                  <span>Sign In</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }
} );
