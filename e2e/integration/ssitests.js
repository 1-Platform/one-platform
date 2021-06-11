import { apps } from "../helper/apps.list";
context( 'Test for SSI', () => {

    before( () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for Notifications section', () => {
        cy.get( '.op-nav-wrapper' ).within( () => {
            cy.contains( 'Notifications' ).click();
        } );
        cy.get( '#op-menu-drawer' ).should( 'be.visible' ).within( () => {
            cy.get( '.op-menu-drawer__title' ).should( 'contain.text', 'All Notifications ' );
        } );
    } );

    it( 'Test for User Profile Section', () => {
        cy.get( '.op-nav-wrapper' ).within( () => {
            cy.get( '.op-menu__item' ).last().click();
        } );
        cy.get( '#op-menu-drawer' ).should( 'be.visible' ).within( () => {
            //user profile icon
            cy.get( '.op-user-profile-icon' ).should( 'be.visible' );
            //User profile name
            cy.get( '.op-menu-drawer__title' ).should( 'contain.text', `${ Cypress.env( 'USERNAME' ) } sso-tester` );
            //Signout section
            cy.get( '.op-user-signout-btn' ).should( 'contain.text', 'Sign Out' );
            //View profile section
            cy.get( `a[href="/user-groups/user/${ Cypress.env( 'USERNAME' ) }"]` ).should( 'contain.text', 'View Profile' );

        } );
    } );

    it( 'Test for Get started Section', () => {
        cy.get( '.op-nav-wrapper' ).within( () => {
            cy.get( 'a[ href = "/get-started" ]' ).should( 'be.visible' );
        } );
    } );
} );
