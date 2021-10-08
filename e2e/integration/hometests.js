/*import { deployment, deployDesc, microservicesHeader, microservicesDesc, microservicesReadmore, inBuiltApps } from "../helper/apps.list";

context( 'Test homepage', () => {
    before( () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for home page header heading', () => {
        cy.get( '.header__content' ).within( () => {
            cy.get( '.header__content-heading' ).should( 'contain.text', 'One Platform helps you build and deploy internal apps, microservice and website' );
        } );
    } );

    it( 'Test for home page header content', () => {
        cy.get( '.header__content' ).within( () => {
            cy.get( 'p' ).should( 'contain.text', 'One Platform provides a single place for all internal applications and services, supports consistent User experience by providing standard platform for service hosting and data integration, efficient resource management, real time metrics availability, cross-team collaboration and unified documentation.' );
        } );
    } );

    it( 'Test for header get started content', () => {
        cy.get( '.header__action-buttons' ).within( () => {
            cy.get( 'a[ href = "/get-started/docs" ]' ).should( 'have.text', 'Get Started' );
        } );
    } );

    it( 'Test for header learn more content', () => {
        cy.get( '.header__action-buttons' ).within( () => {
            cy.get( 'a[ href = "/get-started/" ]' ).should( 'have.text', 'Learn More' );
        } );
    } );

    it( 'Test for easy app deployment section', () => {
        cy.get( '#deployments' ).should( 'be.visible' ).within( () => {
            cy.get( '.section__header' ).should( 'contain.text', 'Easy Deployment steps to follow' );
            deployment.forEach( function ( item ) {
                cy.get( '.section__app-deployment-card' ).each( () => {
                    cy.contains( `${ item }` ).should( 'be.visible' );
                } );
            } );
            deployDesc.forEach( function ( item ) {
                cy.get( '.section__app-deployment-card-description' ).each( () => {
                    cy.contains( `${ item }` ).should( 'be.visible' );
                } );
                cy.get( '.section__app-deployment-action-buttons' ).should( 'have.text', 'Quick Deploy Read More' );
            } );
        } );
    } );

    it( 'Test for Built-In-Microservices section', () => {
        cy.get( '#microservices' ).should( 'be.visible' ).within( () => {
            cy.get( '.section__header' ).should( 'contain.text', 'Built-in Microservices for most common features' );
            microservicesHeader.forEach( function ( item ) {
                cy.get( '.section__microservices-card-header' ).each( () => {
                    cy.contains( `${ item }` ).should( 'be.visible' );
                } );
            } );
            microservicesDesc.forEach( function ( item ) {
                cy.get( '.section__microservices-card-description' ).each( () => {
                    cy.contains( `${ item }` ).should( 'be.visible' );
                } );
            } );
            microservicesReadmore.forEach( function ( item ) {
                cy.get( `a[ href = "${ item }" ]` ).should( 'contain.text', 'Read More' );
            } );
        } );
    } );

    it( 'Test for all applications', () => {
        cy.get( '#applications' ).should( 'be.visible' ).within( () => {
            cy.get( '.section__header' ).should( 'contain.text', 'All Applications' );
            inBuiltApps.forEach( function ( item ) {
                cy.get( '.section__applications-cards' ).within( () => {
                    cy.get( `a[href="${ item }" ]` ).should( 'be.visible' );
                } );
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
} );*/
