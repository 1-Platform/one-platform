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
        cy.get( 'div[class="pf-c-select__toggle-wrapper"] > input[placeholder^="Search"]' ).type( 'one-portal' ).then( () => {
            cy.wait(5000)
            cy.contains( 'one-portal-test', { timeout: 10000 } ).should( 'be.visible' ).click( { force: true } )
        })
        cy.get( '[name="appUrl"]' ).type( "https://www.google.com" )
        cy.get( '[name="schemaEndpoint"]' ).type( "https://www.redhat.com" )
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
