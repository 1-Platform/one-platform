import mockApps from '../src/assets/mocks/apps.json';

describe( 'op-nav component', () => {
  const Utils = {
    get opNav () {
      return document.querySelector( 'op-nav' );
    },
    get opNavAppsButton () {
      return Utils.opNav.shadowRoot.querySelector( '.op-menu__item-button[data-type=app]' );
    },
    get opNavNotificationButton () {
      return Utils.opNav.shadowRoot.querySelector( '.op-menu__item-button[data-type=notification]' );
    },
    get opNavUserButton () {
      return Utils.opNav.shadowRoot.querySelector( '.op-menu__item-button[data-type=user]' );
    },
    get opMenuDrawer () {
      return Utils.opNav.shadowRoot.querySelector( '#op-menu-drawer' );
    }
  };

  beforeAll( () => {
    /* Defining the custom-component */
    require( '../dist/op-nav' );
    /* Appending the component to the DOM */
    document.body.appendChild( document.createElement( 'op-nav' ) );

    mockFetch( mockApps );
  } );

  it( 'creates', () => {
    expect( Utils.opNav ).toBeDefined();
    expect( Utils.opNav.shadowRoot ).toBeDefined();
    expect( Utils.opNav.shadowRoot.childElementCount ).toBeGreaterThan( 0 );
  } );

  it( 'has 3 nav items', () => {
    const menuItems = Utils.opNav.shadowRoot.querySelectorAll( '.op-menu__item' );
    expect( menuItems ).toHaveLength( 3 );
    expect( menuItems.item( 0 ).querySelector( '.op-menu__item-button' ).dataset.type ).toEqual( 'app' );
    expect( menuItems.item( 1 ).querySelector( '.op-menu__item-button' ).dataset.type ).toEqual( 'notification' );
    expect( menuItems.item( 2 ).querySelector( '.op-menu__item-button' ).dataset.type ).toEqual( 'user' );
  } );

  describe( 'App Drawer', () => {
    it( 'opens app drawer', () => {
      expect( Utils.opNav.drawerOpen ).toBeFalsy();

      /* Simulate a click event on the App drawer button */
      Utils.opNavAppsButton.click();

      expect( Utils.opNav.drawerOpen ).toBeTruthy()
      expect( Utils.opNav.activeDrawerType ).toEqual( Utils.opNavAppsButton.dataset.type );
    } );

    it( 'closes app drawer', () => {
      /* Simulate a click event on the App Drawer button */
      Utils.opNavAppsButton.click();
      expect( Utils.opNav.drawerOpen ).toBeFalsy();
    } );
  } );

  describe( 'Notification Drawer', () => {
    it( 'opens app drawer', () => {
      expect( Utils.opNav.drawerOpen ).toBeFalsy();

      /* Sumulate a click event */
      Utils.opNavNotificationButton.click();

      expect( Utils.opNav.drawerOpen ).toBeTruthy();
      expect( Utils.opNav.activeDrawerType ).toEqual( Utils.opNavNotificationButton.dataset.type );
    } );

    it( 'closes app drawer', () => {
      Utils.opNavNotificationButton.click();
      expect( Utils.opNav.drawerOpen ).toBeFalsy();
    } );
  } );

  describe( 'User Profile Drawer', () => {
    it( 'opens app drawer', () => {
      expect( Utils.opNav.drawerOpen ).toBeFalsy();

      /* Sumulate a click event */
      Utils.opNavUserButton.click();

      expect( Utils.opNav.drawerOpen ).toBeTruthy();
      expect( Utils.opNav.activeDrawerType ).toEqual( Utils.opNavUserButton.dataset.type );
    } );

    it( 'closes app drawer', () => {
      Utils.opNavUserButton.click();
      expect( Utils.opNav.drawerOpen ).toBeFalsy();
    } );
  } );
} );
