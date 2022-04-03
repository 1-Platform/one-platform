import { apps } from "../helper/apps.list";
import Sidebar from "../pageObject/Sidebar"
context( 'Test for SSI', () => {
    const sidebar = new Sidebar();
    before( () => {
        cy.viewport( Cypress.env( 'width' ), Cypress.env( 'height' ) );
        cy.visit( Cypress.env( 'STAGE_HOST' ) );
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );

    it( 'Test for Notifications section', () => {
        cy.wait( 3000 );
        cy.get( 'slot[name="opc-nav-btn"] > button:first-child' ).click( { force: true } ).then( () => {

            cy.get( '.opc-notification-drawer__header-title', { force: true } ).invoke( 'text' ).then( ( text ) => {
                expect( text.trim() ).equal( 'Notifications' );
            } );


        } );
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );
    } );
    it( 'Test Application Search in Side Bar', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).focus().click( { force: true } ).then( () => {
            cy.wait( 2000 );
            cy.get( '.opc-menu-drawer' ).within( () => {
                sidebar.getAllApplicationSearchResults().each( ( elem, index ) => {
                    var result = elem.text().toLowerCase().trim();
                    cy.get( 'input[name="seach"]' ).clear().type( result, { force: true } );
                    sidebar.getApplicationSearchResults().contains( result, { matchCase: false } ).should( 'be.visible' );
                } );
                cy.get( 'input[name="seach"]' ).clear();
                cy.wait( 3000 );
                cy.get( '.opc-menu-drawer__header' ).within( () => {
                    cy.get( 'button' ).click( { force: true } );
                } );


            } );

        } );
    } );
    it( 'Test Built in Services Search', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).focus().click( { force: true } ).then( () => {
            cy.wait( 1000 );
            cy.get( '.opc-menu-drawer' ).within( () => {
                sidebar.getAllBuiltInServiceSearchResults().each( ( elem, index ) => {
                    var result = elem.text().toLowerCase().trim();
                    cy.get( 'input[name="seach"]' ).clear().type( result, { force: true } );
                    sidebar.getBuiltInServiceSearchResults().contains( result, { matchCase: false } ).should( 'be.visible' );
                } );
                cy.get( 'input[name="seach"]' ).clear();
            } );
        } );
    } );
    it( 'Test for App Drawer Search with Invalid Data', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).focus().click( { force: true } ).then( () => {
            cy.wait( 1000 );
            cy.get( '.opc-menu-drawer' ).within( () => {
                cy.get( 'input[name="seach"]' ).clear().type( 'asadsaddsasad', { force: true } );
                cy.contains( 'No results found' ).should( 'be.visible' );
            } );
        }
     );
} )


    //Tests for User Profile Section
    it( 'Test for User Profile Icon', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {

                cy.get( '.opc-menu-drawer__avatar',{force:true} ).should( 'be.visible' );
            } );
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } )
    })

    it( 'Test for User Profile name', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {

                cy.get( '.opc-menu-drawer__menu-header-title' ).should( 'contain.text', `${ Cypress.env( 'USERNAME' ) } sso-tester` );
            } );
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } )
    })

    it( 'Test for Logout section', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {

            cy.get( '.opc-menu-drawer__menu-header-title'  ).click({force:true}).then( () => {
                cy.get( 'button[slot="menu"]' ).should( 'contain.text', 'Log Out' ).click( { force: true } );
                cy.url().should('include','auth.stage.redhat.com')
            } );
            //cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );
        } );
    })

    it( 'Test for View profile section', () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) + 'user-groups/' );
        cy.get( '#username').type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {
            cy.get( 'div:nth-child(1) > dialog:nth-child(2) > div:nth-child(3) > div:nth-child(8)' ).click( { force: true } );
        } );
    })


} );
