/// <reference types="Cypress" />
Cypress.on( 'uncaught:exception', ( err, runnable ) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
} )
let words;
context( 'API Catalog Tests', () => {
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
        //this.words=words
        cy.get( 'input[name="name"]' ).type( 'e2e test automation' );
        //cy.get( 'input[name="name"]' ).invoke('text').as('wordID')
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
    } )
    it( "Subscribe Test", () => {
        cy.contains( 'Subscribe' ).click( { force: true } )
        cy.wait(2000)
        cy.contains('Subscribed to').should('be.visible')
    } )
    it( "Unsubscribe Test", () => {
        cy.wait(6000)
        cy.contains( "Subscribed" ).click( { force: true } )
        cy.wait( 2000 )
        cy.contains("Unsubscribed to").should('be.visible')
    } )
    it( 'Check if swagger link is visible', () => {
        cy.get('.pf-c-card__body .pf-c-title.pf-m-md').should('be.visible')
    } )
    it( 'Access the swagger link', () => {
        cy.get( '.pf-c-card__body .pf-c-title.pf-m-md' ).click( { force: true } )
        cy.wait(15000)
        cy.get('.title').contains('Swagger Petstore').should('be.visible')
    } )
    it( 'Navigate to My API', () => {
        cy.contains( 'My API' ).click( { force: true } )
        cy.wait(4000)
        cy.get('.pf-c-card__body').contains('e2e test automation').should('be.visible').click({force:true})

    } )
    it( 'Verify click on Home', () => {
        cy.get('.pf-l-split').contains( 'Home' ).click( { force: true } )
    } )
    it( 'Verify Search for API', () => {
        cy.get( 'input[placeholder^="Search for APIs"]' ).type( 'e2e test automation', { force: true } )
        cy.wait( 300 )
        cy.get( 'a[class="catalog-nav-link"] button[type="button"]').click({force:true})
    })
    it( 'Verifying edit API functionality', () => {
        cy.contains( 'Edit' ).click( { force: true } )
        cy.get( 'input[name="name"]' ).clear().type( 'e2e test automation update' );
        cy.get( '.pf-c-button.pf-m-primary.pf-m-progress' ).click( { force: true } )


    } )
    it( 'Verify Delete API', () => {
        cy.contains( 'Edit' ).click( { force: true } )
        cy.contains( 'Delete' ).click( { force: true } )
        cy.get("footer[class='pf-c-modal-box__footer'] button:nth-child(1)").click({force:true})
    })
    it( 'Click on Explore APIs', () => {
        cy.contains('Explore').click({force:true})
    })

    } );
