import { apps } from "../helper/apps.list";
context( 'Test for SSI', () => {

    before( () => {
        cy.viewport( 1280, 720 );
        cy.visit( Cypress.env( 'QA_HOST' ) );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for Notifications section', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:first-child' ).click({force:true}).then( () => {
            cy.wait( 2000 )
            cy.get( '.opc-notification-drawer__header-title',{force:true} ).invoke( 'text' ).then( ( text ) => {
                expect( text.trim()).equal('Notifications' )
                })


        } );
        cy.get(".opc-notification-drawer__header > button").click({force:true})
    })

    //Tests for User Profile Section
    it( 'Test for User Profile Icon', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {
            cy.wait(2000)
                cy.get( '.opc-menu-drawer__avatar',{force:true} ).should( 'be.visible' );
            } );
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } )
    })

    it( 'Test for User Profile name', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {
            cy.wait( 2000 )
                cy.get( '.opc-menu-drawer__menu-header-title' ).should( 'contain.text', `${ Cypress.env( 'USERNAME' ) } sso-tester` );
            } );
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } )
    })

    it( 'Test for Logout section', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {
            cy.wait(2000)
            cy.get( '.opc-menu-drawer__menu-header-title'  ).click({force:true}).then( () => {
                cy.get( 'button[slot="menu"]' ).should( 'contain.text', 'Log Out' );
            } );
            cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );
        } );
    })

    it( 'Test for View profile section', () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'user-groups/' );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.wait(5000)
        cy.get( '.op-menu__item:last-child > button' ).click( { force: true } ).then( () => {
            cy.wait( 3000 );
            cy.get( '#op-menu-drawer' ).should( 'be.visible' ).within( () => {
                cy.get( '.op-menu-drawer__title' ).should( 'contain.text', `${ Cypress.env( 'USERNAME' ) } sso-tester` );
            } );
        })
    } );

    it( 'Test for Get started Section', () => {
        cy.get( '.op-menu__item:first-child > a' ).within( () => {
            cy.get( 'span' ).should( 'contain.text','Get Started' );
        } );
    } );
} );
