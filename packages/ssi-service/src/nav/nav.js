import html from 'html-template-tag';
import styles from './nav.css';
import { listApps } from './api';

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
        button.addEventListener( 'click', event => this.toggleDrawer( event.target ) );
      } );

      const styleTag = document.createElement( 'style' );
      styleTag.innerText = styles;
      this.shadowRoot.prepend( styleTag );

      listApps()
        .then( res => {
          this.appsList = res;
        } )
        .catch( err => {
          this.appsList = [];
          console.error( err );
        } );
    }
  }

  get isDrawerOpen () {
    return !!this.shadowRoot.getElementById( 'op-menu-drawer' );
  }
  _isDrawerOpenOfType ( type ) {
    const drawerInDOM = this.shadowRoot.getElementById( 'op-menu-drawer' );
    return !!drawerInDOM && drawerInDOM.dataset.type === type;
  }

  _refreshActiveButton () {
    this.shadowRoot.querySelectorAll( '.op-menu__item-button' ).forEach( button => {
      button.classList.remove( 'active' );
      if ( this._isDrawerOpenOfType( button.dataset.type ) ) {
        button.classList.add( 'active' );
      }
    } );
  }

  toggleDrawer ( target ) {
    if ( !target.dataset.type ) {
      return;
    }

    if ( this.isDrawerOpen && this.drawer.dataset.type === target.dataset.type ) {
      this.drawer.open = false;
      this.shadowRoot.getElementById( 'op-menu-drawer' ).remove();
      this._refreshActiveButton();
      return;
    }

    this.drawer.dataset.type = target.dataset.type;
    this.drawer.open = true;

    switch ( target.dataset.type ) {
      case 'app':
        this.drawer.innerHTML = this._appDrawer;
        break;
      case 'notification':
        this.drawer.innerHTML = html`<p>notifications</p>`;
        break;
      case 'user':
        this.drawer.innerHTML = html`<p>user</p>`;
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
    this._refreshActiveButton();
  }

  /* HTML Templates */
  get _template () {
    const template = document.createElement( 'template' );
    template.innerHTML = this._html;

    return template;
  }

  get _appDrawer () {
    return html`<ul class="op-menu-drawer__app-list">`
      + this.appsList.map( app => this._appDrawerItem( app ) ).join( '' )
      + `</ul>`;
  }
  _appDrawerItem ( item ) {
    return html`
      <li class="op-menu-drawer__app-list-item">
        <a href="${ item.url }">
          <img src="${item.logo || '/templates/assets/rh-hat-logo.svg' }"/>
          <h5>
            ${ item.name }
          </h5>
        </a>
      </li>
    `;
  }

  get _html () {
    return html`
      <header class="op-nav">
        <div class="op-nav-wrapper">
          <!-- QSTN: Customizable menu here?? -->
          <a class="op-logo" href="/">
            <img class="op-logo__img" src="/templates/assets/rh-op-logo.svg" alt="Red Hat One Portal">
          </a>

          <form class="op-search">
            <input type="search" name="q" autocomplete="off" aria-label="Search for Applications, Documents or any content" class="op-search-bar__input" placeholder="Search for Applications, Documents or any content" required>
            <button class="op-search__btn" type="submit">
              <ion-icon name="search-outline" class="op-nav__icon"></ion-icon>
            </button>
          </form>

          <nav class="op-menu">
            <ul class="op-menu-wrapper">
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button" data-type="app">
                  <ion-icon name="apps-outline" class="op-nav__icon"></ion-icon>
                  Apps
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button" data-type="notification">
                  <ion-icon name="notifications-outline" class="op-nav__icon"></ion-icon>
                  Notifications
                </button>
              </li>
              <li class="op-menu__item">
                <button type="button" class="op-menu__item-button" data-type="user">
                  <ion-icon name="person-outline" class="op-nav__icon"></ion-icon>
                  Sign In
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }
} );
