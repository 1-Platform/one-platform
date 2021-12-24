/// <reference types="Cypress" />
Cypress.on( 'uncaught:exception', ( err, runnable ) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
} )
context( 'API Catalog Tests', () => {
    before( () => {
        cy.viewport( 1280, 720 );
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
        cy.get( 'input[name="name"]' ).type( 'e2e test automation' );
        cy.get( 'textarea[name="description"]' ).type( "test is on for the api catalog. it seems to be an interesting application. i am liking it very much . this is a test by one of the tester . it seems there are very less bugs in this application. there are more of user experience difficulties found in this spa." )
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
        cy.contains( 'My API' ).click( { force: true } );
        cy.wait( 4000 );
    } )
    it( 'Invalid Search Test', () => {
        cy.get( 'input[aria-label="Search API"]' ).type( 'qwertyuiopasdgthchgbtnjkmnvxs', { force: true } );
        cy.contains( 'No API found', { timeout: 6000 } )
    })
    it( 'Valid search in My APIs Page', () => {
        cy.get( 'input[aria-label="Search API"]' ).clear().type( 'e2e test automation', { force: true } );
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
        cy.get( '.pf-c-button.pf-m-primary.pf-m-progress' ).click( { force: true } );
        cy.get( 'h1' ).should( 'have.text', 'e2e test automation update' );

    } )
    it( 'Verify Delete API', () => {
        cy.contains( 'Edit' ).click( { force: true } )
        cy.contains( 'Delete' ).click( { force: true } )
        cy.get( "footer[class='pf-c-modal-box__footer'] button:nth-child(1)" ).click( { force: true } )
        cy.wait(2000)
    })
    it( 'Click on Explore APIs', () => {
        cy.contains( 'Explore' ).click( { force: true } )
        cy.wait(4000)
        cy.get( '.pf-m-fill > a > .pf-c-button' ).click( { force: true } )

    } )
    it( 'Add GraphQL API Test', () => {
        cy.wait(8000)
        cy.get( 'input[name="name"]' ).type( 'e2e test graphql automation' );
        cy.get( 'textarea[name="description"]' ).type( "test is on for the api catalog. it seems to be an interesting application. i am liking it very much . this is a test by one of the tester . it seems there are very less bugs in this application. there are more of user experience difficulties found in this spa." )
        cy.contains( "GraphQL" ).click( { force: true } )
        cy.get( '#app-layout-page > section.pf-c-page__main-section.pf-m-no-padding.pf-m-light.appLayout_app-layout--content__1Gx8I > section > div > div > div > div:nth-child(2) > form > div:nth-child(4) > div.pf-c-form__group-control > div' ).within( () => {
            cy.get('input[placeholder ^= "Search" ]' ).type( 'portal-test' ).then( () => {
            cy.wait( 5000 );
            cy.contains( 'sso', { timeout: 10000 } ).should( 'not.be.disabled' ).click( { force: true } );
            cy.get( 'span.pf-c-chip__text' ).should( 'be.visible' )
        })
        })
        cy.get( '[name="appUrl"]' ).type( "https://api.gdc.cancer.gov/v0/graphql" )
        cy.get( '[name="schemaEndpoint"]' ).type( "https://api.gdc.cancer.gov/v0/graphql" )
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
        cy.get( '[name="environments.0.apiBasePath"]' ).type( "https://api.gdc.cancer.gov/v0/graphql" )
        cy.get( '.pf-c-button.pf-m-primary.pf-m-progress' ).click( { force: true } )
        cy.wait(3000)

    } )
    it( "Subscribe GraphQL Test", () => {
        cy.contains( 'Subscribe' ).click( { force: true } )
        cy.wait(2000)
        cy.contains('Subscribed to').should('be.visible')
    } )
    it( "Unsubscribe GraphQL Test", () => {
        cy.wait(6000)
        cy.contains( "Subscribed" ).click( { force: true } )
        cy.wait( 2000 )
        cy.contains("Unsubscribed to").should('be.visible')
    } )
    it( 'Click and Open Voyager', () => {
        cy.contains( 'Voyager' ).click( { force: true } );
        cy.wait( 6000 )
        cy.get('.graphql-voyager').should('be.visible')
    } )
    it( 'Going back', () => {
        cy.go('back')
    } )
     it( 'Search for GraphQL API', () => {
        cy.contains( 'My API' ).click( { force: true } );
        cy.wait( 4000 );
        cy.get( 'input[placeholder^="Search for APIs"]' ).type( 'e2e test graphql automation', { force: true } )
        cy.wait( 300 )
         cy.get('.pf-l-split__item.pf-m-fill').contains( 'e2e test graphql' ).click( { force: true } )
         cy.wait(3000)
    } )

 it( 'Verifying edit graphql API functionality', () => {
        cy.contains( 'Edit' ).click( { force: true } )
        cy.get( 'input[name="name"]' ).clear().type( 'e2e test graphql automation update' );
        cy.get( '.pf-c-button.pf-m-primary.pf-m-progress' ).click( { force: true } )
        cy.wait( 2000 )
        cy.get('h1').should('have.text','e2e test graphql automation update')

    } )
     it( 'Verify Delete Graphql API', () => {
        cy.contains( 'Edit' ).click( { force: true } )
        cy.contains( 'Delete' ).click( { force: true } )
        cy.get("footer[class='pf-c-modal-box__footer'] button:nth-child(1)").click({force:true})
    })

    } );
