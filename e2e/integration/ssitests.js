import { apps } from "../helper/apps.list";
context( 'Test for SSI', () => {

    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ));
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );

    it( 'Test for Notifications section', () => {
        cy.get( 'slot[name="opc-nav-btn"] > button:first-child' ).click({force:true}).then( () => {

            cy.get( '.opc-notification-drawer__header-title',{force:true} ).invoke( 'text' ).then( ( text ) => {
                expect( text.trim()).equal('Notifications' )
                })


        } );
        cy.get(".opc-notification-drawer__header > button").click({force:true})
    })

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
                cy.get( 'button[slot="menu"]' ).should( 'contain.text', 'Log Out' );
            } );
            cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );
        } );
    })

    it( 'Test for View profile section', () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'user-groups/' );
        cy.get( '#username').type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( 'slot[name="opc-nav-btn"] > button:last-child' ).click( { force: true } ).then( () => {
            cy.get( 'div:nth-child(1) > dialog:nth-child(2) > div:nth-child(3) > div:nth-child(8)' ).click( { force: true } );
        } );
    })


} );
