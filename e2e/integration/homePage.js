import { apps } from "../helper/apps.list"
context( 'Test homepage', () => {
    before( () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) );
        Cypress.config( 'includeShadowDom', true );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env('USERNAME') );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for home page header section', () => {
        cy.get( '.hero__mantra' ).should( 'contain.text', 'Develop Fast·Deliver Faster' );
        cy.get( '.hero__quote' ).should( 'contain.text', 'One Platform to host your Internal Applications and Services' );
        cy.get( '.hero__description' ).should( 'contain.text', 'One Platform provides a single place for all internal applications and services, supports consistent User experience by providing standard platform for service hosting and data integration, efficient resource management, real time metrics availability, cross-team collaboration and unified documentation.' );
        cy.get( '.button--danger' ).should( 'contain.text', 'View Applications' );
        cy.get( '.button--light' ).should( 'contain.text', 'Built-in Microservices' );
    } );

    it( 'Test that all the deployed apps are visible', () => {
        cy.get( '.apps__list' ).should( 'be.visible' ).within( () => {
            apps.forEach( function ( item ) {
                cy.get( `a[ href = "${ item }" ]` ).should( 'be.visible' );
            })
        } );
    })

    it( 'Test for Built-In-Microservices section', () => {
        cy.get( '#microservice-cards' ).within( () => {
            cy.get( '.PFElement ' ).each( () => {
                cy.get( 'a[ href = "/get-started/docs/microservices/feedback/feedback-service" ]' ).should( 'have.text', 'Learn More' );
                cy.get( 'a[ href = "/get-started/docs/microservices/authorization/authorization-service" ]' ).should( 'have.text', 'Learn More' );
                cy.get( 'a[ href = "#" ]' ).should( 'have.text', 'Learn More' );
                cy.get( 'a[ href = "/get-started/docs/microservices/user-groups/user-groups-service" ]' ).should( 'have.text', 'Learn More' );
                cy.get( 'a[ href = "/get-started/docs/microservices/notifications/notifications-service" ]' ).should( 'have.text', 'Learn More' );
            } );
        } );
    } );

    it( 'Test for footer section', () => {
        //Quick links
        cy.get( '.link-category' ).within( () => {
            cy.get( '.link-category__name' ).should( 'have.text', 'Quick Links' );
            cy.get( 'a[ href = "https://source.redhat.com/groups/public/pnt-devops/oneportal" ]' ).should( 'have.text', 'One Platform on The Source' );
            cy.get( 'a[ href = "/get-started/blog/" ]' ).should( 'have.text', 'One Platform Blog' );
            cy.get( 'a[ href = "/contact-us" ]' ).should( 'have.text', 'Contact Us' );
        } );
    } );
} )
