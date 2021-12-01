/// <reference types="Cypress" />
Cypress.on( 'uncaught:exception', ( err, runnable ) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
} )
context( 'Home Page Tests', () => {
    before( () => {
        cy.visit( Cypress.env( 'QA_HOST' ) +'developers/api-catalog');
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );
    it( 'Add API Test', () => {
        cy.contains( 'Add API' ).click( { force: true } );
    } )
    it( 'Fill the add API form', () => {
        cy.faker = require( 'faker' );
        const words = cy.faker.lorem.words();
        cy.get( 'input[name="name"]' ).type( words );
        cy.get( 'textarea[name="description"]' ).type( "test" )
        cy.contains( "REST" ).click( { force: true } )
        cy.get( '#app-layout-page > section.pf-c-page__main-section.pf-m-no-padding.pf-m-light.appLayout_app-layout--content__1Gx8I > section > div > div > div > div:nth-child(2) > form > div:nth-child(4) > div.pf-c-form__group-control > div' ).within( () => {
            cy.get('input[placeholder ^= "Search" ]' ).type( 'portal-test' ).then( () => {
            cy.wait( 5000 );
            cy.contains( 'sso', { timeout: 10000 } ).should( 'not.be.disabled' ).click( { force: true } );
            cy.get( 'span.pf-c-chip__text' ).should( 'be.visible' )
        })
        })
        cy.get( '[name="appUrl"]' ).type( "https://www.google.com" )
        cy.get( '[name="schemaEndpoint"]' ).type( "https://petstore.swagger.io/v2/swagger.json" )
        cy.get( '[aria-label^="Select a"]' ).click( { force: true } ).then( () => {
            cy.get( 'button[role="option"]' ).then( ( elements ) => {
                // Get a random number using the max number of elements.
                const max = elements.length;
                const min = 1;
                const randomNumber = Math.floor( Math.random() * ( max - min ) + min );

                // Wrap the DOM element so we can execute new cypress commands.
                // Use the randomized number to select a DOM element, then click it.
                cy.wrap( elements[ randomNumber ] ).click( { force: true } );
            } );
        })
        cy.get( '[name="environments.0.apiBasePath"]' ).type( "https://reqres.in/api/users?page=2" )


    } )
    it( "Click on Submit", () => {
        cy.get( '.pf-c-button.pf-m-primary.pf-m-progress' ).click( { force: true } )
    })
    } );
